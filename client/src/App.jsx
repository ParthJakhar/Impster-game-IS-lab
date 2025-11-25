import React, { useEffect, useState, useMemo } from "react";
import { getSocket } from "./socket";
import Lobby from "./components/Lobby";
import Messages from "./components/Messages";
import Nameform from "./components/Nameform";
import ServerConfig from "./components/ServerConfig";

const MIN_PLAYERS = 3;

export default function App() {
  const [name, setName] = useState("");
  const [connected, setConnected] = useState(false);
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [role, setRole] = useState(null);
  const [word, setWord] = useState(null);
  const [cluesRevealed, setCluesRevealed] = useState(false);
  const [revealedClues, setRevealedClues] = useState({}); // name -> clue
  const [votingProgress, setVotingProgress] = useState({ voters: [], votesCount: 0, aliveCount: 0 });

  // derived
  const me = useMemo(() => players.find(p => p.name === name) || null, [players, name]);
  const isHost = useMemo(() => players.length > 0 && players[0].name === name, [players, name]);

  const pushMessage = (m) => setMessages(prev => [...prev, m]);
  const [socketKey, setSocketKey] = useState(0); // Force re-render when socket changes

  useEffect(() => {
    // Get current socket instance
    const socket = getSocket();

    const onConnect = () => {
      setConnected(true);
      pushMessage({ type: "system", text: "Connected", time: Date.now() });
    };
    const onDisconnect = () => {
      setConnected(false);
      pushMessage({ type: "system", text: "Disconnected", time: Date.now() });
    };

    const onPlayerList = (list) => {
      setPlayers(Array.isArray(list) ? list : []);
    };

    const onSystemMessage = (payload) => {
      pushMessage({ type: "system", text: payload.text, time: payload.time || Date.now() });
    };

    const onChatMessage = (payload) => {
      pushMessage({ type: "chat", from: payload.from, text: payload.text, time: payload.time || Date.now() });
    };

    const onGameStarted = (payload) => {
      setGameStarted(true);
      setRole(null);
      setWord(null);
      setCluesRevealed(false);
      setRevealedClues({});
      pushMessage({ type: "system", text: `Game started (${payload.numPlayers} players)`, time: Date.now() });
    };

    const onYourRole = (payload) => {
      setRole(payload.role);
      pushMessage({ type: "system", text: `You are ${payload.role}`, time: Date.now() });
    };

    const onYourWord = (payload) => {
      setWord(payload.word);
      pushMessage({ type: "system", text: `Your word assigned`, time: Date.now() });
    };

    const onClueSubmitted = (payload) => {
      pushMessage({ type: "system", text: `${payload.name} submitted a clue`, time: Date.now() });
    };

    const onAllCluesRevealed = (payload) => {
      setCluesRevealed(true);
      setRevealedClues(payload.clues || {});
      pushMessage({ type: "system", text: "All clues revealed", time: Date.now() });
    };

    const onVotingStarted = (payload) => {
      pushMessage({ type: "system", text: "Voting started", time: Date.now() });
      setVotingProgress({ voters: [], votesCount: 0, aliveCount: payload.aliveCount || 0 });
    };

    const onVoteCast = (payload) => {
      pushMessage({ type: "vote", text: `${payload.voterName} voted for ${payload.targetName}`, time: payload.time || Date.now() });
    };

    const onVotingUpdate = (payload) => {
      setVotingProgress({ voters: payload.voters || [], votesCount: payload.votesCount || 0, aliveCount: payload.aliveCount || 0 });
    };

    const onVoteResults = (payload) => {
      pushMessage({ type: "vote_results", eliminatedName: payload.eliminatedName, tally: payload.tally, time: Date.now() });
    };

    const onGameOver = (payload) => {
      setGameStarted(false);
      setRole(null);
      setWord(null);
      setCluesRevealed(false);
      setRevealedClues({});
      pushMessage({ type: "system", text: `Game over — winner: ${payload.winner}`, time: Date.now() });
    };

    const onGameError = (payload) => {
      pushMessage({ type: "system", text: `Error: ${payload.msg}`, time: Date.now() });
    };

    // Check initial connection status
    if (socket.connected) {
      setConnected(true);
    }

    // register
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("player_list", onPlayerList);
    socket.on("system_message", onSystemMessage);
    socket.on("chat_message", onChatMessage);
    socket.on("game_started", onGameStarted);
    socket.on("your_role", onYourRole);
    socket.on("your_word", onYourWord);
    socket.on("clue_submitted", onClueSubmitted);
    socket.on("all_clues_revealed", onAllCluesRevealed);
    socket.on("voting_started", onVotingStarted);
    socket.on("vote_cast", onVoteCast);
    socket.on("voting_update", onVotingUpdate);
    socket.on("vote_results", onVoteResults);
    socket.on("game_over", onGameOver);
    socket.on("game_error", onGameError);

    // cleanup
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("player_list", onPlayerList);
      socket.off("system_message", onSystemMessage);
      socket.off("chat_message", onChatMessage);
      socket.off("game_started", onGameStarted);
      socket.off("your_role", onYourRole);
      socket.off("your_word", onYourWord);
      socket.off("clue_submitted", onClueSubmitted);
      socket.off("all_clues_revealed", onAllCluesRevealed);
      socket.off("voting_started", onVotingStarted);
      socket.off("vote_cast", onVoteCast);
      socket.off("voting_update", onVotingUpdate);
      socket.off("vote_results", onVoteResults);
      socket.off("game_over", onGameOver);
      socket.off("game_error", onGameError);
    };
  }, [socketKey]); // Re-run when socket changes

  // UI actions
  const handleSetName = (playerName) => {
    setName(playerName);
    const socket = getSocket();
    socket.emit("join", { name: playerName });
  };

  const sendChat = (text) => {
    if (!name || !text) return;
    const socket = getSocket();
    const payload = { from: name, text };
    socket.emit("chat_message", payload);
    pushMessage({ type: "chat", from: name, text, time: Date.now() });
  };

  const startGame = () => {
    if (!isHost) {
      pushMessage({ type: "system", text: "Only host can start", time: Date.now() });
      return;
    }
    if (players.length < MIN_PLAYERS) {
      pushMessage({ type: "system", text: `Need at least ${MIN_PLAYERS} players to start`, time: Date.now() });
      return;
    }
    const socket = getSocket();
    socket.emit("start_game", {});
  };

  const submitClue = (clue) => {
    const socket = getSocket();
    socket.emit("submit_clue", { clue });
  };

  const startVoting = () => {
    if (!isHost) {
      pushMessage({ type: "system", text: "Only host can start voting", time: Date.now() });
      return;
    }
    if (players.length < MIN_PLAYERS) {
      pushMessage({ type: "system", text: `Need at least ${MIN_PLAYERS} players to vote`, time: Date.now() });
      return;
    }
    const socket = getSocket();
    socket.emit("start_voting", {});
  };

  const castVote = (targetSid) => {
    const socket = getSocket();
    socket.emit("cast_vote", { targetId: targetSid });
  };

  const handleServerConnected = () => {
    // Force re-registration of event listeners with new socket
    setSocketKey(prev => prev + 1);
  };

  const leaveRoom = () => {
    const socket = getSocket();
    socket.emit("leave_room");
    setName("");
    setGameStarted(false);
    setRole(null);
    setWord(null);
    setCluesRevealed(false);
    setRevealedClues({});
    setVotingProgress({ voters: [], votesCount: 0, aliveCount: 0 });
    setPlayers([]);
    setMessages(prev => [...prev, { type: "system", text: "You left the room", time: Date.now() }]);
  };

  const hasMinimumPlayers = players.length >= MIN_PLAYERS;

  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header" style={{ alignItems: "center" }}>
          <h1>Imposter</h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="status">
              <span className={`dot ${connected ? "online" : "offline"}`}></span>
              <span>{connected ? "Connected" : "Disconnected"}</span>
            </div>
            {name ? (
              <>
                {isHost ? (
                  <>
                    <button
                      className="primary-btn"
                      onClick={startGame}
                      disabled={!hasMinimumPlayers}
                    >
                      Start Game
                    </button>
                    <button
                      className="primary-btn"
                      onClick={startVoting}
                      disabled={!hasMinimumPlayers}
                    >
                      Start Voting
                    </button>
                  </>
                ) : null}
                <button
                  className="ghost-btn"
                  onClick={leaveRoom}
                >
                  Leave Room
                </button>
              </>
            ) : null}
          </div>
        </header>

        {!connected ? (
          <ServerConfig onConnected={handleServerConnected} />
        ) : !name ? (
          <Nameform onSubmit={handleSetName} />
        ) : (
          <div className="main-grid">
            <Lobby players={players} playerCount={players.length} me={name} gameStarted={gameStarted} onVote={castVote} />
            <Messages
              messages={messages}
              onSend={sendChat}
              role={role}
              word={word}
              cluesRevealed={cluesRevealed}
              revealedClues={revealedClues}
              submitClue={submitClue}
              votingProgress={votingProgress}
              myName={name}
            />
          </div>
        )}
        <footer className="app-footer">
        </footer>
      </div>
    </div>
  );
}
