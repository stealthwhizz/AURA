import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api, Prediction, Alert, AlertStats } from '@/lib/api';
import { 
  BarChart3, 
  Bell, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Minus,
  ArrowRight,
  Calendar,
  Droplets,
  Warehouse
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { farmer } = useAuth();
  const [latestPrediction, setLatestPrediction] = useState<Prediction | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [alertStats, setAlertStats] = useState<AlertStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!farmer) return;
      
      try {
        // Fetch latest prediction
        const predictions = await api.getPredictionHistory(farmer._id, 1);
        if (predictions.length > 0) {
          setLatestPrediction(predictions[0]);
        }

        // Fetch recent alerts
        const alerts = await api.getAlerts(farmer._id, false);
        setRecentAlerts(alerts.slice(0, 3));

        // Fetch alert stats
        const stats = await api.getAlertStats(farmer._id);
        setAlertStats(stats);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Use mock data for demo
        setLatestPrediction({
          _id: 'demo-1',
          farmer: farmer._id,
          location: { latitude: -1.2921, longitude: 36.8219 },
          riskScore: 32,
          riskLevel: 'moderate',
          confidence: 85,
          recommendations: ['Improve ventilation', 'Monitor moisture levels'],
          storageType: 'Silo',
          storageQuality: 'Good',
          moistureContent: 14.5,
          createdAt: new Date().toISOString(),
        });
        setRecentAlerts([
          {
            _id: 'alert-1',
            farmer: farmer._id,
            prediction: 'demo-1',
            type: 'risk_warning',
            severity: 'medium',
            title: 'Moderate Risk Detected',
            message: 'Your latest prediction shows moderate aflatoxin risk. Consider improving storage conditions.',
            isRead: false,
            isAcknowledged: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
        setAlertStats({
          total: 5,
          unread: 2,
          bySeverity: { low: 2, medium: 2, high: 1, critical: 0 },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [farmer]);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingDown className="w-4 h-4 text-success" />;
      case 'worsening':
        return <TrendingUp className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse-soft text-muted-foreground">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Hello, {farmer?.name?.split(' ')[0] || 'Farmer'} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your crop safety overview
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/predictions">
              <Button variant="gradient">
                <BarChart3 className="w-4 h-4" />
                New Prediction
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Current Risk"
            value={latestPrediction ? (
              <RiskBadge level={latestPrediction.riskLevel} score={latestPrediction.riskScore} size="sm" />
            ) : (
              <span className="text-muted-foreground text-sm">No data</span>
            )}
            icon={<BarChart3 className="w-5 h-5" />}
            iconBg="bg-primary/10 text-primary"
          />
          <StatCard
            label="Unread Alerts"
            value={alertStats?.unread || 0}
            icon={<Bell className="w-5 h-5" />}
            iconBg="bg-warning/10 text-warning"
          />
          <StatCard
            label="Confidence"
            value={latestPrediction ? `${latestPrediction.confidence}%` : '-'}
            icon={<Shield className="w-5 h-5" />}
            iconBg="bg-success/10 text-success"
          />
          <StatCard
            label="Moisture"
            value={latestPrediction ? `${latestPrediction.moistureContent}%` : '-'}
            icon={<Droplets className="w-5 h-5" />}
            iconBg="bg-info/10 text-info"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Latest Prediction Card */}
          <div className="card-elevated p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-foreground">Latest Prediction</h2>
              <Link to="/predictions" className="text-sm text-primary hover:underline flex items-center gap-1">
                View History <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {latestPrediction ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <RiskBadge level={latestPrediction.riskLevel} score={latestPrediction.riskScore} size="lg" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getTrendIcon('stable')}
                    <span>Stable</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Warehouse className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Storage</p>
                      <p className="font-medium text-foreground">{latestPrediction.storageType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(latestPrediction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {latestPrediction.recommendations.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-2">💡 Recommendations</p>
                    <ul className="space-y-1">
                      {latestPrediction.recommendations.slice(0, 2).map((rec, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No predictions yet</p>
                <Link to="/predictions">
                  <Button variant="outline">Get Your First Prediction</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Alerts Card */}
          <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-foreground">Recent Alerts</h2>
              <Link to="/alerts" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentAlerts.length > 0 ? (
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <AlertItem key={alert._id} alert={alert} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No alerts yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/predictions" className="card-elevated p-5 hover:shadow-medium transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Request Prediction</p>
                <p className="text-sm text-muted-foreground">Get risk assessment</p>
              </div>
            </div>
          </Link>

          <Link to="/certifications" className="card-elevated p-5 hover:shadow-medium transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Get Certified</p>
                <p className="text-sm text-muted-foreground">Blockchain verification</p>
              </div>
            </div>
          </Link>

          <Link to="/profile" className="card-elevated p-5 hover:shadow-medium transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Bell className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Alert Settings</p>
                <p className="text-sm text-muted-foreground">Manage notifications</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ 
  label, 
  value, 
  icon, 
  iconBg 
}: { 
  label: string; 
  value: React.ReactNode; 
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="card-elevated p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconBg)}>
          {icon}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function AlertItem({ alert }: { alert: Alert }) {
  const severityColors = {
    low: 'border-l-risk-low',
    medium: 'border-l-risk-moderate',
    high: 'border-l-risk-high',
    critical: 'border-l-risk-critical',
  };

  const severityEmojis = {
    low: '✅',
    medium: '⚠️',
    high: '🔶',
    critical: '🚨',
  };

  return (
    <div className={cn(
      'p-3 rounded-lg bg-secondary/50 border-l-4 transition-colors',
      severityColors[alert.severity],
      !alert.isRead && 'bg-secondary'
    )}>
      <div className="flex items-start gap-2">
        <span className="text-lg">{severityEmojis[alert.severity]}</span>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium text-sm truncate',
            !alert.isRead ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {alert.title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {alert.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(alert.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
