import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Shield, 
  BarChart3, 
  Bell, 
  QrCode, 
  ArrowRight,
  CheckCircle,
  Smartphone
} from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-xl text-foreground">AURA</span>
              <p className="text-xs text-muted-foreground">Crop Safety System</p>
            </div>
          </div>
          
          <Link to="/auth">
            <Button variant="default">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12 lg:py-24">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Trusted by 1,000+ farmers
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Protect Your Harvest from{' '}
            <span className="text-primary">Aflatoxin</span> Risk
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AURA uses AI-powered predictions and blockchain verification to help you 
            monitor, manage, and certify the safety of your crops.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="gradient" size="xl">
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="xl">
              <Smartphone className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Risk Predictions"
            description="Get AI-powered aflatoxin risk assessments based on your storage conditions and location."
            delay="0s"
          />
          <FeatureCard
            icon={<Bell className="w-6 h-6" />}
            title="Smart Alerts"
            description="Receive timely notifications when risk levels change or action is needed."
            delay="0.1s"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Blockchain Certification"
            description="Get verifiable, tamper-proof certifications for your safe crops."
            delay="0.2s"
          />
          <FeatureCard
            icon={<QrCode className="w-6 h-6" />}
            title="QR Verification"
            description="Buyers can instantly verify your crop safety with a simple QR scan."
            delay="0.3s"
          />
        </div>

        {/* Trust Section */}
        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground mb-4">Powered by</p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            <span className="text-lg font-semibold text-foreground">🌍 Climate Data</span>
            <span className="text-lg font-semibold text-foreground">🔗 Blockchain</span>
            <span className="text-lg font-semibold text-foreground">🤖 AI/ML</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">AURA</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 AURA. Protecting harvests, securing futures.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div 
      className="card-elevated p-6 hover:shadow-medium transition-all animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
