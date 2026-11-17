const P: Record<string, string> = {
  home: "M3 11l9-7 9 7v9H5v-9", layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5", receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  file: "M7 3h7l5 5v13H7zM14 3v5h5", chat: "M4 5h16v11H8l-4 4z", users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-4 3-6 7-6s7 2 7 6M17 11a3 3 0 1 0 0-6M22 20c0-3-2-5-5-5",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2", book: "M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2zM8 7h8",
  check: "M5 12l4 4L19 6", chart: "M4 20V10M10 20V4M16 20v-7M22 20H2", card: "M3 6h18v12H3zM3 10h18", out: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  ext: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6", spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6", arrow: "M5 12h14M13 6l6 6-6 6",
};
export default function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[name] ?? P.spark}/></svg>;
}
