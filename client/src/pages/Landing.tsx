import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Shield, TrendingUp, Bell, Sparkles, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            CardVault
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Your intelligent credit card management companion
          </p>
          <Button 
            size="lg"
            className="bg-white text-purple-900 hover:bg-purple-50"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-purple-400/30">
            <CreditCard className="w-12 h-12 text-purple-300 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Card Management</h3>
            <p className="text-purple-200">
              Track all your credit cards in one beautiful dashboard
            </p>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border-purple-400/30">
            <TrendingUp className="w-12 h-12 text-purple-300 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Rewards Tracking</h3>
            <p className="text-purple-200">
              Never miss a reward with intelligent progress tracking
            </p>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border-purple-400/30">
            <Bell className="w-12 h-12 text-purple-300 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Real-Time Alerts</h3>
            <p className="text-purple-200">
              Get instant notifications for transactions and rewards
            </p>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border-purple-400/30">
            <Shield className="w-12 h-12 text-purple-300 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Credit Score</h3>
            <p className="text-purple-200">
              Monitor your credit score with improvement suggestions
            </p>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border-purple-400/30">
            <BarChart3 className="w-12 h-12 text-purple-300 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Spending Analytics</h3>
            <p className="text-purple-200">
              Understand your spending with detailed breakdowns
            </p>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border-purple-400/30">
            <Sparkles className="w-12 h-12 text-purple-300 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">AI Recommendations</h3>
            <p className="text-purple-200">
              Get personalized credit card offers based on your spending
            </p>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-purple-300">
            Secure authentication powered by your workspace
          </p>
        </div>
      </div>
    </div>
  );
}
