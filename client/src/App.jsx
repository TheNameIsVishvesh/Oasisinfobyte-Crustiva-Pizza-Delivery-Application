import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Pizza, 
  Activity, 
  Terminal, 
  GitBranch, 
  CheckCircle, 
  Server, 
  Laptop, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Mail,
  CreditCard
} from 'lucide-react';

// Common Layout Component
function Header() {
  return (
    <header class="glass-card sticky top-0 z-50 backdrop-blur-md shadow-premium border-b border-white/20 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" class="flex items-center gap-3 group">
          <div class="bg-gradient-to-tr from-pizza-primary to-pizza-secondary p-2.5 rounded-2xl shadow-glow group-hover:scale-110 transition-transform duration-300">
            <Pizza class="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-tight text-pizza-charcoal flex items-center gap-1.5">
              <span>SliceLife</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-pizza-primary/10 text-pizza-primary font-semibold tracking-normal">v1.0.0</span>
            </h1>
            <p class="text-xs text-pizza-charcoal/60">Gourmet Delivery Application</p>
          </div>
        </Link>

        <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" class="text-pizza-charcoal hover:text-pizza-primary transition-colors">Home</Link>
          <a href="#architecture" class="text-pizza-charcoal/70 hover:text-pizza-primary transition-colors">Architecture</a>
          <a href="#git-flow" class="text-pizza-charcoal/70 hover:text-pizza-primary transition-colors">Git Workflow</a>
          <a href="#health" class="text-pizza-charcoal/70 hover:text-pizza-primary transition-colors">System Health</a>
        </nav>

        <div class="flex items-center gap-4">
          <a 
            href="https://github.com/mern-pizza-delivery-app" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="flex items-center gap-1.5 bg-pizza-charcoal text-white hover:bg-pizza-primary hover:shadow-glow px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300"
          >
            <span>GitHub Repository</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

// 1. Home Dashboard Page
function Home() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHealthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pinging the Express health endpoint via Vite Proxy
      const response = await axios.get('/api/health');
      setHealthData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to reach Express server. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  return (
    <div class="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Hero Welcome */}
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-gradient-to-br from-pizza-charcoal to-[#18120e] p-8 lg:p-12 rounded-[2.5rem] shadow-premium text-white relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-pizza-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-pizza-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div class="lg:col-span-7 space-y-6 z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-pizza-accent tracking-wide uppercase">
            <Zap class="w-3.5 h-3.5 animate-pulse" />
            <span>Oasis Infobyte Internship Project</span>
          </div>
          <h2 class="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Professional Full-Stack <br />
            <span class="text-pizza-primary">Pizza Delivery Foundation</span>
          </h2>
          <p class="text-white/70 text-base leading-relaxed max-w-xl">
            A battle-tested full-stack web application skeleton implementing clean architecture, scalable folder structure, automated GitHub workflows, modern Git branching, and strict environmental separation.
          </p>
          <div class="flex flex-wrap gap-4 pt-2">
            <a href="#health" class="bg-pizza-primary text-white hover:bg-pizza-primary/90 px-6 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2">
              <span>Run Health Verification</span>
              <ChevronRight class="w-4 h-4" />
            </a>
            <Link to="/router-demo" class="bg-white/10 text-white hover:bg-white/20 border border-white/10 px-6 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300">
              Test React Router
            </Link>
          </div>
        </div>

        <div class="lg:col-span-5 flex justify-center lg:justify-end relative">
          <div class="relative w-72 h-72 lg:w-80 lg:h-80 bg-white/5 border border-white/10 rounded-full flex items-center justify-center p-8 backdrop-blur-3xl animate-bounce-slow">
            <Pizza class="w-40 h-40 text-pizza-accent animate-spin-slow" />
            <div class="absolute -top-4 -right-4 bg-pizza-primary text-white p-4 rounded-3xl shadow-glow text-center">
              <span class="block text-2xl font-black">100%</span>
              <span class="block text-[10px] uppercase font-bold tracking-wider opacity-90">MERN Seeded</span>
            </div>
          </div>
        </div>
      </section>

      {/* Integration & Verification Terminal */}
      <section id="health" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 class="text-2xl font-bold tracking-tight text-pizza-charcoal">MERN Integration Status</h3>
            <p class="text-sm text-pizza-charcoal/60">Live verification of the connection between React frontend (Vite Proxy) and Node.js Express backend.</p>
          </div>
          <button 
            onClick={fetchHealthStatus}
            disabled={loading}
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-pizza-primary/20 text-pizza-primary hover:bg-pizza-primary hover:text-white disabled:opacity-50 text-sm font-semibold transition-all duration-300"
          >
            <Activity class={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Pinging Backend...' : 'Re-verify Health Status'}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Status Display Panel */}
          <div class="lg:col-span-5 space-y-4">
            <div class="glass-card p-6 rounded-3xl shadow-premium border border-white space-y-6">
              <div class="flex items-center justify-between border-b border-pizza-charcoal/5 pb-4">
                <span class="text-sm font-semibold text-pizza-charcoal/70">Frontend Environment</span>
                <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                  <Laptop class="w-3.5 h-3.5" />
                  <span>Vite + React (Port 5173)</span>
                </span>
              </div>

              <div class="flex items-center justify-between border-b border-pizza-charcoal/5 pb-4">
                <span class="text-sm font-semibold text-pizza-charcoal/70">Backend Proxy Route</span>
                <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-100">
                  <Server class="w-3.5 h-3.5" />
                  <span>Express Port 5000</span>
                </span>
              </div>

              <div class="space-y-3">
                <span class="text-sm font-semibold text-pizza-charcoal/70 block">MERN API Integration Health</span>
                {loading ? (
                  <div class="h-16 flex items-center justify-center bg-pizza-light rounded-2xl border border-dashed border-pizza-accent/40 text-sm text-pizza-charcoal/60">
                    Checking database status and Express server...
                  </div>
                ) : error ? (
                  <div class="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-100 text-xs space-y-1">
                    <p class="font-bold">❌ Connection Failed</p>
                    <p>{error}</p>
                    <p class="text-[10px] text-rose-600/80 mt-2">Check: Is Express server running on port 5000? Did you run `npm run dev` in both folders?</p>
                  </div>
                ) : healthData ? (
                  <div class="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 space-y-2">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="w-5 h-5 text-emerald-600" />
                      <span class="font-bold text-sm">Successfully Connected</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/50 mt-1">
                      <div>
                        <span class="block text-[10px] text-emerald-600 uppercase font-semibold">Uptime</span>
                        <span class="font-medium text-emerald-950">{Math.round(healthData.uptime)} seconds</span>
                      </div>
                      <div>
                        <span class="block text-[10px] text-emerald-600 uppercase font-semibold">MongoDB Atlas</span>
                        <span class="font-medium text-emerald-950 capitalize">{healthData.dbState}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div class="h-16 flex items-center justify-center bg-pizza-light rounded-2xl border border-dashed border-pizza-charcoal/10 text-sm text-pizza-charcoal/40">
                    No diagnostics run yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* JSON Payload Inspector */}
          <div class="lg:col-span-7 bg-pizza-charcoal text-white rounded-3xl p-6 shadow-premium font-mono text-xs flex flex-col justify-between border border-white/5 relative overflow-hidden">
            <div class="absolute right-0 top-0 w-32 h-32 bg-pizza-primary/10 rounded-full blur-3xl"></div>
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-white/10 pb-3">
                <div class="flex items-center gap-2">
                  <Terminal class="w-4 h-4 text-pizza-accent" />
                  <span class="font-semibold tracking-wide">API Payload Response Terminal</span>
                </div>
                <div class="flex gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                </div>
              </div>
              <div class="overflow-x-auto min-h-36">
                <pre class="text-pizza-accent/90">
                  {loading ? (
                    `$ curl -X GET http://localhost:5173/api/health\nHTTP/1.1 202 Accepted\nContent-Type: application/json\n\nLoading payload...`
                  ) : error ? (
                    `$ curl -X GET http://localhost:5173/api/health\n\nERROR: ECONNREFUSED 127.0.0.1:5000`
                  ) : healthData ? (
                    `$ curl -X GET http://localhost:5173/api/health\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n${JSON.stringify(healthData, null, 2)}`
                  ) : (
                    `$ curl -X GET http://localhost:5173/api/health\n\nWaiting for payload check...`
                  )}
                </pre>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-white/5 text-[10px] text-white/40 flex items-center justify-between">
              <span>Request Protocol: HTTP/1.1</span>
              <span>Content-Length: {healthData ? JSON.stringify(healthData).length : 0} bytes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Modules */}
      <section id="architecture" class="space-y-6">
        <div>
          <h3 class="text-2xl font-bold tracking-tight text-pizza-charcoal">System Architecture Setup</h3>
          <p class="text-sm text-pizza-charcoal/60">Fully initialized configurations and libraries ready for business logic expansion.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass-card p-6 rounded-3xl border border-white hover:shadow-premium transition-all duration-300 group">
            <div class="p-3 bg-pizza-primary/10 rounded-2xl w-fit text-pizza-primary group-hover:bg-pizza-primary group-hover:text-white transition-all duration-300">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <h4 class="font-bold text-lg mt-4 text-pizza-charcoal">JWT & bcrypt</h4>
            <p class="text-xs text-pizza-charcoal/60 mt-1 leading-relaxed">Secured authentication pipelines prepared. Cryptographic hashing and token signing schemas configured.</p>
          </div>

          <div class="glass-card p-6 rounded-3xl border border-white hover:shadow-premium transition-all duration-300 group">
            <div class="p-3 bg-pizza-primary/10 rounded-2xl w-fit text-pizza-primary group-hover:bg-pizza-primary group-hover:text-white transition-all duration-300">
              <Mail class="w-6 h-6" />
            </div>
            <h4 class="font-bold text-lg mt-4 text-pizza-charcoal">Resend SDK</h4>
            <p class="text-xs text-pizza-charcoal/60 mt-1 leading-relaxed">Email notification handler integrated. Fully prepared to send professional order summaries via HTML mail templates.</p>
          </div>

          <div class="glass-card p-6 rounded-3xl border border-white hover:shadow-premium transition-all duration-300 group">
            <div class="p-3 bg-pizza-primary/10 rounded-2xl w-fit text-pizza-primary group-hover:bg-pizza-primary group-hover:text-white transition-all duration-300">
              <CreditCard class="w-6 h-6" />
            </div>
            <h4 class="font-bold text-lg mt-4 text-pizza-charcoal">Razorpay SDK</h4>
            <p class="text-xs text-pizza-charcoal/60 mt-1 leading-relaxed">Payment gateways setup for Test Mode. Ready for order-creation, capturing payments, and webhooks verification.</p>
          </div>

          <div class="glass-card p-6 rounded-3xl border border-white hover:shadow-premium transition-all duration-300 group">
            <div class="p-3 bg-pizza-primary/10 rounded-2xl w-fit text-pizza-primary group-hover:bg-pizza-primary group-hover:text-white transition-all duration-300">
              <GitBranch class="w-6 h-6" />
            </div>
            <h4 class="font-bold text-lg mt-4 text-pizza-charcoal">GitHub Actions CI</h4>
            <p class="text-xs text-pizza-charcoal/60 mt-1 leading-relaxed">Continuous integration pipeline initialized. Fully validates linting rules and backend server dependencies automatically on push.</p>
          </div>
        </div>
      </section>

      {/* Professional Git Workflow */}
      <section id="git-flow" class="glass-card p-8 rounded-[2rem] border border-white shadow-premium relative overflow-hidden">
        <div class="absolute right-0 bottom-0 w-48 h-48 bg-pizza-accent/5 rounded-full blur-2xl"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-5 space-y-4">
            <h3 class="text-2xl font-bold tracking-tight text-pizza-charcoal">Git branching model</h3>
            <p class="text-sm text-pizza-charcoal/70 leading-relaxed">
              We employ a professional trunk-based Git workflow. Development is performed on the <code>develop</code> branch, while the <code>main</code> branch remains production-ready and fully locked.
            </p>
            <div class="space-y-2 text-xs font-semibold text-pizza-charcoal/80">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                <span><code>main</code> — Stable release branch</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span><code>develop</code> — Integration branch for features</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span><code>feature/&lt;name&gt;</code> — Dedicated developer sandboxes</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7 bg-[#fffcf8] border border-pizza-primary/10 rounded-2xl p-6 font-mono text-xs text-pizza-charcoal/80 space-y-4">
            <div class="flex items-center justify-between border-b border-pizza-primary/5 pb-2 text-[10px] text-pizza-charcoal/50">
              <span>GIT CLI WORKFLOW DEMO</span>
              <span>POWERSHELL/BASH</span>
            </div>
            <pre class="space-y-1">
              <div><span class="text-pizza-primary"># Create and switch to develop integration branch</span></div>
              <div>$ git checkout -b develop</div>
              <div class="text-emerald-700">Switched to a new branch 'develop'</div>
              <div class="pt-2"><span class="text-pizza-primary"># Launch developer feature branch</span></div>
              <div>$ git checkout -b feature/auth-setup develop</div>
              <div class="text-emerald-700">Switched to a new branch 'feature/auth-setup'</div>
              <div class="pt-2"><span class="text-pizza-primary"># Stage, commit and push changes safely</span></div>
              <div>$ git add .</div>
              <div>$ git commit -m "feat(auth): initialize jwt token verification middleware"</div>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

// 2. React Router Demo Page
function RouterDemo() {
  return (
    <div class="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <div class="glass-card p-8 rounded-3xl shadow-premium border border-white space-y-6">
        <div class="flex items-center gap-3">
          <div class="bg-pizza-accent/10 p-3 rounded-2xl text-pizza-accent">
            <Zap class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-pizza-charcoal">React Router Integration works!</h2>
            <p class="text-sm text-pizza-charcoal/60">Verification of client-side routing capabilities.</p>
          </div>
        </div>

        <div class="p-6 bg-pizza-light rounded-2xl border border-pizza-charcoal/5 text-sm leading-relaxed space-y-4">
          <p>
            You have successfully navigated to a separate route (<code>/router-demo</code>) using <code>&lt;Routes&gt;</code> and <code>&lt;Route&gt;</code> inside your <code>App.jsx</code> client.
          </p>
          <p>
            This confirms that:
          </p>
          <ul class="list-disc list-inside space-y-1.5 font-medium text-pizza-charcoal/80">
            <li>Router mounting is properly configured in <code>main.jsx</code></li>
            <li>Routing matches dynamic browser path changes instantaneously</li>
            <li>Layout remains consistent across client routing state</li>
          </ul>
        </div>

        <div class="flex items-center gap-4">
          <Link to="/" class="bg-pizza-primary text-white hover:bg-pizza-primary/90 px-6 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main App Router Shell
export default function App() {
  const location = useLocation();

  return (
    <div class="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        
        {/* Router Viewport */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/router-demo" element={<RouterDemo />} />
        </Routes>
      </div>

      {/* Global Footer */}
      <footer class="bg-pizza-charcoal text-white py-12 border-t border-white/5 mt-16">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div class="flex items-center gap-2">
              <Pizza class="w-5 h-5 text-pizza-accent" />
              <span class="font-extrabold text-lg tracking-tight">SliceLife</span>
            </div>
            <p class="text-xs text-white/50 mt-1 max-w-sm">
              Level 3 Oasis Infobyte MERN Internship Delivery Stack. Full setup verified and structured for production excellence.
            </p>
          </div>
          <div class="flex flex-col md:items-end text-xs text-white/50 space-y-1.5">
            <span>Server Proxy: http://localhost:5000/api</span>
            <span>Client Platform: Vite + React + Tailwind</span>
            <span>Created with Antigravity AI Suite v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
