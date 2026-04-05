'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContractInput } from '@/components/ContractInput';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [contractText, setContractText] = useState("");
  const router = useRouter();

  async function handleAnalyze() {
    setLoading(true)
    setResult(null); // Clear previous results
    
    try {
      const res = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText })
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const { result } = await res.json()
      const parsed = JSON.parse(result)
      setResult(parsed)
    } catch (err: any) {
      console.error('Analysis Error:', err);
      alert(`Oops! ${err.message}. This is usually a temporary connection issue. Please try again.`);
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="w-full h-full py-12 px-4 lg:px-8 max-w-5xl mx-auto">
      {loading ? (
        <LoadingAnimation />
      ) : result ? (
        <div className="animate-fade-in space-y-8">
          {/* Back button */}
          <button 
            onClick={() => setResult(null)}
            className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors print:hidden"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Analyze New Document
          </button>

          {/* Contract Metadata Bar */}
          {(result.parties || result.contractType || result.governingLaw) && (
            <div className="flex flex-wrap gap-3">
              {result.contractType && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                  {result.contractType}
                </span>
              )}
              {result.parties?.partyA && (
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border/50">
                  👤 {result.parties.partyA} vs {result.parties.partyB || 'Other Party'}
                </span>
              )}
              {result.governingLaw && result.governingLaw !== 'Not specified' && (
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border/50">
                  ⚖️ {result.governingLaw}
                </span>
              )}
            </div>
          )}

          {/* Trust Score Card */}
          <Card className="p-8 md:p-12 overflow-hidden relative spotlight-bg border-primary/20 shadow-2xl">
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
             <div className="relative z-10 space-y-8">
               <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <div 
                    className="text-7xl md:text-9xl font-black tracking-tighter"
                    style={{ color: result.trustScore > 70 ? "#22c55e" : result.trustScore > 40 ? "#f97316" : "#ef4444" }}
                  >
                    {result.trustScore}
                    <span className="text-3xl text-muted-foreground ml-2 opacity-50">/100</span>
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Final Risk Score
                  </div>
               </div>

               {/* Summary */}
               <div className="p-6 bg-muted/50 rounded-2xl border border-border/50">
                  <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 italic">
                    &ldquo;{result.summary}&rdquo;
                  </p>
               </div>
             </div>
          </Card>

          {/* Clause-by-Clause Audit */}
          {result.clauseAnalysis && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-2">
                <span>📋</span> Clause-by-Clause Audit
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(result.clauseAnalysis).map(([key, clause]: [string, any]) => {
                  const statusColor = clause.status === 'present' ? 'green' : clause.status === 'missing' ? 'red' : 'orange';
                  const statusIcon = clause.status === 'present' ? '✅' : clause.status === 'missing' ? '❌' : '⚠️';
                  return (
                    <Card key={key} className="p-6 space-y-3 border-border/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground capitalize text-base">{key}</h3>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full`}
                          style={{ 
                            color: statusColor === 'green' ? '#16a34a' : statusColor === 'red' ? '#dc2626' : '#ea580c',
                            background: statusColor === 'green' ? '#16a34a15' : statusColor === 'red' ? '#dc262615' : '#ea580c15',
                          }}
                        >
                          {statusIcon} {clause.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{clause.assessment}</p>
                      {clause.pointsDeducted > 0 && (
                        <div className="text-xs font-bold text-red-500">
                          −{clause.pointsDeducted} points deducted
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Red Flags with Evidence */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-wider text-red-500 flex items-center gap-2">
              <span>🚩</span> Red Flags & Evidence
            </h2>
            <div className="space-y-4">
              {(result.redFlags || []).map((flag: any, i: number) => {
                const isRichFlag = typeof flag === 'object';
                const riskText = isRichFlag ? flag.risk : flag;
                const evidence = isRichFlag ? flag.evidence : null;
                const severity = isRichFlag ? flag.severity : 'medium';
                const severityColor = severity === 'critical' ? '#dc2626' : severity === 'high' ? '#ea580c' : '#f59e0b';
                
                return (
                  <Card key={i} className="p-5 space-y-3 border-red-500/10 hover:border-red-500/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-foreground leading-relaxed flex-1">{riskText}</p>
                      {isRichFlag && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{ color: severityColor, background: severityColor + '15' }}
                        >
                          {severity}
                        </span>
                      )}
                    </div>
                    {evidence && (
                      <div className="pl-4 border-l-2 border-red-500/30">
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                          &ldquo;{evidence}&rdquo;
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Negotiation Points */}
          {result.negotiationPoints && result.negotiationPoints.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <span>💬</span> Negotiation Points
              </h2>
              <div className="space-y-3">
                {result.negotiationPoints.map((point: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl hover:bg-primary/10 transition-colors">
                     <span className="text-primary font-bold mt-0.5">{i + 1}.</span>
                     <p className="text-sm font-medium text-foreground/80 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Report */}
          <div className="pt-4 flex justify-center print:hidden">
             <button 
               onClick={() => window.print()}
               className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl hover:scale-105 hover:-translate-y-1 transition-all active:scale-95 shimmer text-lg"
             >
               📄 Download Report as PDF
             </button>
          </div>
        </div>
      ) : (
        <ContractInput 
          onAnalyze={handleAnalyze} 
          isLoading={loading} 
          contractText={contractText}
          setContractText={setContractText}
        />
      )}
    </main>
  );
}
