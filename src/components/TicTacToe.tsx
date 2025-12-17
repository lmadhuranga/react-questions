import { useMemo, useState } from "react";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => getWinner(board), [board]);
  const isDraw = !winner && board.every(Boolean);
  const turn = xIsNext ? "X" : "O";

  const status = winner
    ? `Winner: ${winner.player}`
    : isDraw
    ? "Draw!"
    : `Turn: ${turn}`;

  function handleClick(i) {
    if (board[i] || winner) return;

    setBoard((prev) => {
      const next = [...prev];
      next[i] = turn;
      return next;
    });
    setXIsNext((p) => !p);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Tic Tac Toe</h1>

        <div style={styles.status}>{status}</div>

        <div style={styles.grid}>
          {board.map((val, i) => {
            const highlight = winner?.line.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                style={{
                  ...styles.cell,
                  ...(highlight ? styles.cellWin : {}),
                }}
                aria-label={`cell-${i}`}
              >
                {val}
              </button>
            );
          })}
        </div>

        <div style={styles.footer}>
          <button onClick={reset} style={styles.resetBtn}>
            Restart
          </button>
          <div style={styles.hint}>X starts • Click a square to play</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0b1020",
    padding: 24,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  },
  card: {
    width: 360,
    maxWidth: "95vw",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    color: "#fff",
  },
  title: { margin: 0, fontSize: 24, letterSpacing: 0.3 },
  status: {
    marginTop: 10,
    marginBottom: 14,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },
  cell: {
    height: 90,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 36,
    cursor: "pointer",
    transition: "transform 120ms ease, background 120ms ease",
    userSelect: "none",
  },
  cellWin: {
    background: "rgba(0, 255, 170, 0.18)",
    border: "1px solid rgba(0, 255, 170, 0.35)",
    transform: "scale(1.03)",
  },
  footer: { marginTop: 16, display: "grid", gap: 10 },
  resetBtn: {
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  hint: { fontSize: 12, opacity: 0.8 },
};
