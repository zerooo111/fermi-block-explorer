import { Link } from "@tanstack/react-router";

export default function NavHome() {
    return (
        <header className="sticky top-0 left-0 border-y bg-muted py-2">
            <nav className="container flex items-center justify-between mx-auto px-6 max-w-7xl">
                <div className="text-2xl font-bold flex items-center gap-2">
                    FERMI <span className="font-light">Explorer</span>
                    <span className="bg-green-300 border border-green-600 py-0.5 px-1.5 text-xs text-emerald-900 font-mono">
                        TESTNET
                    </span>
                </div>
                <div className="flex items-center gap-1   px-1 py-1 bg-black/15 ">
                    <Link
                        to="/rollup"
                        className="hover: hover:bg-white/30 px-1 py-1   "
                        activeProps={{ className: "font  bg-white " }}
                    >
                        Rollup
                    </Link>
                    <Link
                        to="/continuum"
                        className="hover:  hover:bg-white/30  px-1 py-1 "
                        activeProps={{ className: "font  bg-white " }}
                    >
                        Continuum
                    </Link>
                </div>
            </nav>
        </header>
    );
}