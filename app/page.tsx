export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Análise Mercado Livre
        </h1>
        <p className="text-gray-600 mb-8">
          Sistema funcionando! Carregando funcionalidades...
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Status do Sistema</h2>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span>Deploy:</span>
              <span className="text-green-600">✅ OK</span>
            </div>
            <div className="flex justify-between">
              <span>Frontend:</span>
              <span className="text-green-600">✅ OK</span>
            </div>
            <div className="flex justify-between">
              <span>API ML:</span>
              <span className="text-yellow-600">⏳ Carregando</span>
            </div>
            <div className="flex justify-between">
              <span>Firebase:</span>
              <span className="text-yellow-600">⏳ Carregando</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}