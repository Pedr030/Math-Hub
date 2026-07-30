import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resolver, fmt } from './triangleSolver';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ToolCard from '../../components/ui/ToolCard';
import Modal from '../../components/ui/Modal';

const CAMPOS = [
  { id: 'a', tipo: 'lado',   label: 'a' },
  { id: 'b', tipo: 'lado',   label: 'b' },
  { id: 'c', tipo: 'lado',   label: 'c' },
  { id: 'A', tipo: 'angulo', label: 'A' },
  { id: 'B', tipo: 'angulo', label: 'B' },
  { id: 'C', tipo: 'angulo', label: 'C' },
];

const ERROS_I18N = {
  TRIANGULO_INVALIDO:   'tools.triangleSolver.erros.invalido',
  ANGULOS_INVALIDOS:    'tools.triangleSolver.erros.angulos',
  DADOS_INSUFICIENTES:  'tools.triangleSolver.erros.insuficiente',
  PRECISA_LADO:         'tools.triangleSolver.erros.precisaLado',
  CASO_NAO_RECONHECIDO: 'tools.triangleSolver.erros.casoNaoReconhecido',
};

function SolucaoCard({ solucao, titulo, t }) {
  const classifKeys = solucao.classificacao.map(
    (c) => t(`tools.triangleSolver.classificacao.${c}`)
  );

  return (
    <div className="rounded-lg border border-brand-100 dark:border-brand-900 overflow-hidden">
      {titulo && (
        <div className="bg-brand-50 dark:bg-brand-900/40 px-4 py-2">
          <p className="font-mono text-xs text-brand-500">{titulo}</p>
        </div>
      )}
      <div className="p-4 space-y-4">
        {/* Lados e ângulos */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t('tools.triangleSolver.output.ladoA'), value: fmt(solucao.a) },
            { label: t('tools.triangleSolver.output.ladoB'), value: fmt(solucao.b) },
            { label: t('tools.triangleSolver.output.ladoC'), value: fmt(solucao.c) },
            { label: t('tools.triangleSolver.output.anguloA'), value: `${fmt(solucao.A)}°` },
            { label: t('tools.triangleSolver.output.anguloB'), value: `${fmt(solucao.B)}°` },
            { label: t('tools.triangleSolver.output.anguloC'), value: `${fmt(solucao.C)}°` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-slate-50 dark:bg-brand-950/60 p-2.5">
              <p className="font-mono text-xs text-slate-400 mb-0.5">{label}</p>
              <p className="font-mono font-semibold text-slate-700 dark:text-slate-200 text-sm">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Área, perímetro e classificação */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg bg-brand-50 dark:bg-brand-900/40 p-3">
            <p className="font-mono text-xs text-brand-500 mb-0.5">
              {t('tools.triangleSolver.output.area')}
            </p>
            <p className="font-display font-semibold text-brand-700 dark:text-brand-300">
              {fmt(solucao.area)}
            </p>
          </div>
          <div className="rounded-lg bg-brand-50 dark:bg-brand-900/40 p-3">
            <p className="font-mono text-xs text-brand-500 mb-0.5">
              {t('tools.triangleSolver.output.perimetro')}
            </p>
            <p className="font-display font-semibold text-brand-700 dark:text-brand-300">
              {fmt(solucao.perimetro)}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-brand-950/60 p-3">
            <p className="font-mono text-xs text-slate-400 mb-0.5">
              {t('tools.triangleSolver.output.classificacao')}
            </p>
            <p className="font-mono text-xs text-slate-700 dark:text-slate-200">
              {classifKeys.join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TriangleSolver() {
  const { t } = useTranslation();

  const [valores, setValores] = useState({
    a: '', b: '', c: '', A: '', B: '', C: '',
  });
  const [solucoes, setSolucoes] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  function handleChange(id, val) {
    setValores((prev) => ({ ...prev, [id]: val }));
  }

  function handleCalcular(e) {
    e.preventDefault();
    setErro(null);
    setSolucoes(null);

    const entrada = {};
    for (const { id } of CAMPOS) {
      const v = valores[id].trim();
      if (v === '') { entrada[id] = null; continue; }
      const n = Number(v);
      if (isNaN(n) || n <= 0) {
        setErro(t('tools.triangleSolver.erros.valorInvalido', { campo: id }));
        return;
      }
      entrada[id] = n;
    }

    try {
      const res = resolver(entrada);
      setSolucoes(res);
    } catch (err) {
      const chave = ERROS_I18N[err.message];
      setErro(chave ? t(chave) : t('tools.triangleSolver.erros.invalido'));
    }
  }

  function handleLimpar() {
    setValores({ a: '', b: '', c: '', A: '', B: '', C: '' });
    setSolucoes(null);
    setErro(null);
  }

  return (
    <ToolCard>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          aria-label={t('tools.triangleSolver.ajuda.titulo')}
          title={t('tools.triangleSolver.ajuda.titulo')}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200
                     text-xs font-semibold text-brand-500 hover:bg-brand-50
                     dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900"
        >
          ?
        </button>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {t('tools.triangleSolver.instrucao')}
      </p>

      <form onSubmit={handleCalcular} className="space-y-4">
        {/* Lados */}
        <div>
          <p className="font-mono text-xs text-brand-500 uppercase tracking-wide mb-2">
            {t('tools.triangleSolver.lados')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {CAMPOS.filter(c => c.tipo === 'lado').map(({ id, label }) => (
              <div key={id}>
                <label className="block font-mono text-xs text-slate-400 mb-1">{label}</label>
                <Input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="—"
                  value={valores[id]}
                  onChange={(e) => handleChange(id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Ângulos */}
        <div>
          <p className="font-mono text-xs text-brand-500 uppercase tracking-wide mb-2">
            {t('tools.triangleSolver.angulos')} (°)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {CAMPOS.filter(c => c.tipo === 'angulo').map(({ id, label }) => (
              <div key={id}>
                <label className="block font-mono text-xs text-slate-400 mb-1">{label}</label>
                <Input
                  type="number"
                  step="any"
                  min="0"
                  max="180"
                  placeholder="—"
                  value={valores[id]}
                  onChange={(e) => handleChange(id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit">{t('tools.triangleSolver.calcular')}</Button>
          <Button type="button" variant="secondary" onClick={handleLimpar}>
            {t('tools.triangleSolver.limpar')}
          </Button>
        </div>
      </form>

      {erro && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {t('common.erroPre')} {erro}
        </p>
      )}

      {solucoes && (
        <div className="mt-6 space-y-4">
          {solucoes.length > 1 && (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-2
                            dark:bg-yellow-950/30 dark:border-yellow-900">
              <p className="font-mono text-xs text-yellow-700 dark:text-yellow-400">
                ⚠ {t('tools.triangleSolver.casoAmbiguo')}
              </p>
            </div>
          )}
          {solucoes.map((sol, i) => (
            <SolucaoCard
              key={i}
              solucao={sol}
              titulo={solucoes.length > 1
                ? t('tools.triangleSolver.solucao', { n: i + 1 })
                : null}
              t={t}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={mostrarAjuda}
        onClose={() => setMostrarAjuda(false)}
        title={t('tools.triangleSolver.ajuda.titulo')}
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t('tools.triangleSolver.ajuda.comoUsar.titulo')}
          </p>
          <p>{t('tools.triangleSolver.ajuda.comoUsar.desc')}</p>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t('tools.triangleSolver.ajuda.casos.titulo')}
          </p>
          <ul className="font-mono text-xs space-y-1 text-slate-500 dark:text-slate-400">
            <li>{t('tools.triangleSolver.ajuda.casos.lll')}</li>
            <li>{t('tools.triangleSolver.ajuda.casos.lal')}</li>
            <li>{t('tools.triangleSolver.ajuda.casos.ala')}</li>
            <li>{t('tools.triangleSolver.ajuda.casos.aal')}</li>
            <li>{t('tools.triangleSolver.ajuda.casos.ssa')}</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
            {t('tools.triangleSolver.ajuda.ambiguo.titulo')}
          </p>
          <p>{t('tools.triangleSolver.ajuda.ambiguo.desc')}</p>
        </div>
      </Modal>
    </ToolCard>
  );
}

export default TriangleSolver;