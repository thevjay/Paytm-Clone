import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-16 px-6">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-800">Welcome to Paytm</h1>
          <p className="text-lg text-gray-600">
            Fast, Secure, and Reliable Payments at Your Fingertips.
          </p>
          <div className="space-x-4">
            <Link to="/signup">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Get Started</button>
            </Link>
            <Link to="/signin">
              <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900">Sign In</button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon="💸"
            title="Quick Transfers"
            description="Send money to anyone instantly."
          />
          <FeatureCard
            icon="🔒"
            title="Secure Transactions"
            description="Your payments are protected with advanced encryption."
          />
          <FeatureCard
            icon="📊"
            title="Account Management"
            description="Manage your balance and track expenses easily."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-lg text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-2xl font-bold mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}