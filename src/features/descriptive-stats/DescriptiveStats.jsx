import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, Legend, // <- Importamos o Legend aqui
  AreaChart, Area, 
  ScatterChart, Scatter, 
  XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { calcularEstatisticas } from "./statistics";
import Button from "../../components/ui/Button";
import ToolCard from "../../components/ui/ToolCard";
import Modal from "../../components/ui/Modal";

function fmt(n, casas = 4) {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(casas)).toString();
}

function ResultCard({ label, value, destaque = false }) {
  return (
    <div
      className={`rounded-lg p-3 ${
        destaque
          ? "bg-brand-50 dark:bg-brand-900/40"
          : "bg-slate-50 dark:bg-brand-950/60"
      }`}
    >
      <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mb-0.5">
        {label}
      </p>
      <p
        className={`font-display font-semibold ${
          destaque
            ? "text-xl text-brand-700 dark:text-brand-300"
            : "text-lg text-slate-700 dark:text-slate-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DescriptiveStats() {
  const { t } = useTranslation();
  const [entrada, setEntrada] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);
  const [graficoAtivo, setGraficoAtivo] = useState("barras");

  function handleCalcular(e) {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    if (!entrada.trim()) {
      setErro(t("tools.descriptiveStats.erros.vazio"));
      return;
    }

    try {
      setResultado(calcularEstatisticas(entrada));
    } catch (err) {
      setErro(err.message);
    }
  }

  function formatarModa(moda) {
    if (!moda) return t("tools.descriptiveStats.semModa");
    return moda.map(fmt).join(", ");
  }

  let dadosAgrupados = [];
  let dadosDispersao = [];
  
  if (resultado) {
    const mapFreq = new Map();
    
    resultado.numeros.forEach((n, index) => {
      mapFreq.set(n, (mapFreq.get(n) || 0) + 1);
      dadosDispersao.push({ indice: index + 1, valor: n });
    });
    
    let frequenciaAcumulada = 0;
    dadosAgrupados = Array.from(mapFreq.entries())
      .sort(([valorA], [valorB]) => valorA - valorB)
      .map(([valor, frequencia]) => {
        frequenciaAcumulada += frequencia;
        return {
          valorFormatado: fmt(valor),
          valorBruto: valor,
          frequencia: frequencia,
          acumulada: frequenciaAcumulada,
        };
      });
  }

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t("tools.descriptiveStats.ajuda.titulo")}
          title={t("tools.descriptiveStats.ajuda.titulo")}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      <form onSubmit={handleCalcular} className="space-y-3">
        <textarea
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder={t("tools.descriptiveStats.placeholder")}
          rows={3}
          className="w-full rounded-lg border border-brand-100 bg-white px-3 py-2
                     font-mono text-sm resize-none focus:outline-none focus:ring-2
                     focus:ring-brand-400 dark:border-brand-800 dark:bg-brand-950
                     dark:text-slate-100"
        />
        <Button type="submit">{t("tools.descriptiveStats.calcular")}</Button>
      </form>

      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {t("common.erroPre")} {erro}
        </p>
      )}

      {resultado && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard destaque label={t("tools.descriptiveStats.output.media")} value={fmt(resultado.media)} />
            <ResultCard destaque label={t("tools.descriptiveStats.output.mediana")} value={fmt(resultado.mediana)} />
            <ResultCard destaque label={t("tools.descriptiveStats.output.desvioPadrao")} value={fmt(resultado.desvioPadrao)} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label={t("tools.descriptiveStats.output.minimo")} value={fmt(resultado.minimo)} />
            <ResultCard label={t("tools.descriptiveStats.output.maximo")} value={fmt(resultado.maximo)} />
            <ResultCard label={t("tools.descriptiveStats.output.amplitude")} value={fmt(resultado.amplitude)} />
            <ResultCard label={t("tools.descriptiveStats.output.contagem")} value={resultado.contagem} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultCard label={t("tools.descriptiveStats.output.moda")} value={formatarModa(resultado.moda)} />
            <ResultCard label={t("tools.descriptiveStats.output.variancia")} value={fmt(resultado.variancia)} />
          </div>

          <div className="rounded-lg border border-brand-100 dark:border-brand-900 bg-white dark:bg-brand-950 p-4">
            
            <div className="flex gap-2 mb-6 border-b border-slate-100 dark:border-brand-900 pb-2 overflow-x-auto custom-scrollbar">
              {[
                { id: "barras", label: t("tools.descriptiveStats.graficos.barras", "Barras") },
                { id: "pizza", label: t("tools.descriptiveStats.graficos.pizza", "Pizza") },
                { id: "area", label: t("tools.descriptiveStats.graficos.area", "Acumulada") },
                { id: "dispersao", label: t("tools.descriptiveStats.graficos.dispersao", "Dispersão") }
              ].map((aba) => (
                <button
                  key={aba.id}
                  type="button"
                  onClick={() => setGraficoAtivo(aba.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap
                    ${graficoAtivo === aba.id
                      ? "bg-brand-500 text-white"
                      : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-brand-900"
                    }`}
                >
                  {aba.label}
                </button>
              ))}
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                
                {graficoAtivo === "barras" && (
                  <BarChart data={dadosAgrupados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="valorFormatado" stroke="currentColor" className="text-xs text-slate-400 font-mono" />
                    <YAxis allowDecimals={false} stroke="currentColor" className="text-xs text-slate-400 font-mono" width={40} />
                    <Tooltip 
                      formatter={(valor) => [valor, t("tools.descriptiveStats.output.frequenciaTooltip", "Frequência")]}
                      labelFormatter={(label) => `${t("tools.descriptiveStats.output.valor", "Valor")}: ${label}`}
                      cursor={{ fill: 'var(--tooltip-cursor, #334155)', opacity: 0.15 }}
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="frequencia" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                )}

                {/* GRÁFICO DE PIZZA (ATUALIZADO) */}
                {graficoAtivo === "pizza" && (
                  <PieChart>
                    <Tooltip 
                      formatter={(valor, name, props) => {
                        const porcentagem = ((valor / resultado.contagem) * 100).toFixed(1);
                        return [`${valor} (${porcentagem}%)`, `${t("tools.descriptiveStats.output.valor", "Valor")}: ${props.payload.valorFormatado}`];
                      }}
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    
                    {/* LEGENDA ADICIONADA AQUI */}
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', color: 'var(--text-slate-400, #94a3b8)' }}
                    />

                    <Pie
                      data={dadosAgrupados}
                      dataKey="frequencia"
                      nameKey="valorFormatado"
                      cx="50%"
                      cy="45%" // Subimos levemente o centro do gráfico para dar mais espaço à legenda
                      outerRadius={75} // Diminuído um pouco para a legenda não encostar
                      innerRadius={40}
                      paddingAngle={2}
                    >
                      {/* GERAÇÃO DE CORES INFINITA COM HSL */}
                      {dadosAgrupados.map((entry, index) => {
                        // Calcula o HUE dividindo o círculo 360 pelo número de barras
                        const hue = (index * (360 / Math.max(dadosAgrupados.length, 1))) % 360;
                        const corDinamica = `hsl(${hue}, 75%, 55%)`; // 75% saturação (vivo), 55% brilho (equilibrado)
                        
                        return <Cell key={`cell-${index}`} fill={corDinamica} />;
                      })}
                    </Pie>
                  </PieChart>
                )}

                {graficoAtivo === "area" && (
                  <AreaChart data={dadosAgrupados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="valorFormatado" stroke="currentColor" className="text-xs text-slate-400 font-mono" />
                    <YAxis allowDecimals={false} stroke="currentColor" className="text-xs text-slate-400 font-mono" width={40} />
                    <Tooltip 
                      formatter={(valor) => [valor, t("tools.descriptiveStats.graficos.area", "Acumulada")]}
                      labelFormatter={(label) => `${t("tools.descriptiveStats.output.valor", "Valor")}: ${label}`}
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="acumulada" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                )}

                {graficoAtivo === "dispersao" && (
                  <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis type="number" dataKey="indice" name="Índice" stroke="currentColor" className="text-xs text-slate-400 font-mono" tickCount={dadosDispersao.length > 10 ? 10 : dadosDispersao.length} />
                    <YAxis type="number" dataKey="valor" name="Valor" stroke="currentColor" className="text-xs text-slate-400 font-mono" width={40} />
                    <ZAxis range={[50, 50]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(valor, name) => [valor, name === 'Índice' ? t("tools.descriptiveStats.output.ordem", "Ordem") : t("tools.descriptiveStats.output.valor", "Valor")]}
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Scatter name="Valores" data={dadosDispersao} fill="#f43f5e" />
                  </ScatterChart>
                )}

              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-brand-100 dark:border-brand-900 overflow-hidden">
            <div className="bg-brand-50 dark:bg-brand-900/40 px-4 py-2">
              <p className="font-mono text-xs text-brand-500">
                {t("tools.descriptiveStats.output.ordenados")} ({resultado.contagem})
              </p>
            </div>
            <p className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 leading-relaxed break-all">
              {resultado.numeros.map(fmt).join("  ·  ")}
            </p>
          </div>
        </div>
      )}

      <Modal isOpen={mostrarAjuda} onClose={() => setMostrarAjuda(false)} title={t("tools.descriptiveStats.ajuda.titulo")}>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">{t("tools.descriptiveStats.ajuda.entrada.titulo")}</p>
          <p>{t("tools.descriptiveStats.ajuda.entrada.desc")}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">{t("tools.descriptiveStats.ajuda.metricas.titulo")}</p>
          <ul className="space-y-1 font-mono text-xs text-slate-500 dark:text-slate-400">
            <li>{t("tools.descriptiveStats.ajuda.metricas.media")}</li>
            <li>{t("tools.descriptiveStats.ajuda.metricas.mediana")}</li>
            <li>{t("tools.descriptiveStats.ajuda.metricas.moda")}</li>
            <li>{t("tools.descriptiveStats.ajuda.metricas.desvioPadrao")}</li>
            <li>{t("tools.descriptiveStats.ajuda.metricas.variancia")}</li>
            <li>{t("tools.descriptiveStats.ajuda.metricas.amplitude")}</li>
          </ul>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default DescriptiveStats;