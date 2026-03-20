'use client';

export default function TestRoutingPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 rounded-xl shadow-xl">
          <h1 className="text-4xl font-bold mb-4">✅ Routing Works!</h1>
          <p className="text-xl mb-4">
            If you can see this page, Next.js routing is working correctly!
          </p>
          <p className="text-lg">
            Current URL: <code className="bg-white/20 px-2 py-1 rounded">/page/cms/test-routing</code>
          </p>
          <p className="text-sm mt-4 opacity-80">
            This page was created to test if Next.js routing is functioning properly.
          </p>
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl border-2 border-green-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Expected Routes:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ /page/cms/dashboard</li>
            <li>✅ /page/cms/articles</li>
            <li>✅ /page/cms/categories</li>
            <li>✅ /page/cms/users</li>
            <li>✅ /page/cms/test-routing (you are here)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
