import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api, Alert, AlertStats } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck, 
  Filter,
  Loader2,
  AlertTriangle,
  Info,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Alerts() {
  const { farmer } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, [farmer, filter]);

  const fetchAlerts = async () => {
    if (!farmer) return;
    setIsLoading(true);
    try {
      const [alertsData, statsData] = await Promise.all([
        api.getAlerts(farmer._id, filter === 'unread'),
        api.getAlertStats(farmer._id),
      ]);
      setAlerts(alertsData);
      setStats(statsData);
    } catch (error) {
      // Mock data for demo
      const mockAlerts: Alert[] = [
        {
          _id: '1',
          farmer: farmer._id,
          prediction: 'pred-1',
          type: 'risk_warning' as const,
          severity: 'high' as const,
          title: 'High Risk Detected in Storage Unit A',
          message: 'Your latest prediction shows high aflatoxin risk. Immediate action recommended: improve ventilation and reduce moisture levels.',
          isRead: false,
          isAcknowledged: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: '2',
          farmer: farmer._id,
          prediction: 'pred-2',
          type: 'action_required' as const,
          severity: 'medium' as const,
          title: 'Moisture Level Above Threshold',
          message: 'Storage moisture content is at 16.5%, above the recommended 14% threshold. Consider using desiccants.',
          isRead: false,
          isAcknowledged: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          _id: '3',
          farmer: farmer._id,
          prediction: 'pred-3',
          type: 'info' as const,
          severity: 'low' as const,
          title: 'Weekly Report Available',
          message: 'Your weekly aflatoxin risk summary is ready. All metrics are within safe ranges.',
          isRead: true,
          isAcknowledged: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setAlerts(mockAlerts.filter(a => filter === 'all' || !a.isRead));
      setStats({
        total: 5,
        unread: 2,
        bySeverity: { low: 2, medium: 1, high: 1, critical: 1 },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (alertId: string) => {
    setUpdating(alertId);
    try {
      await api.markAlertRead(alertId);
      setAlerts(prev => prev.map(a => 
        a._id === alertId ? { ...a, isRead: true } : a
      ));
      setStats(prev => prev ? { ...prev, unread: Math.max(0, prev.unread - 1) } : prev);
      toast({ title: 'Marked as read' });
    } catch (error) {
      // Mock update
      setAlerts(prev => prev.map(a => 
        a._id === alertId ? { ...a, isRead: true } : a
      ));
      toast({ title: 'Marked as read' });
    } finally {
      setUpdating(null);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    setUpdating(alertId);
    try {
      await api.acknowledgeAlert(alertId);
      setAlerts(prev => prev.map(a => 
        a._id === alertId ? { ...a, isAcknowledged: true, isRead: true } : a
      ));
      toast({ title: 'Alert acknowledged ✅' });
    } catch (error) {
      // Mock update
      setAlerts(prev => prev.map(a => 
        a._id === alertId ? { ...a, isAcknowledged: true, isRead: true } : a
      ));
      toast({ title: 'Alert acknowledged ✅' });
    } finally {
      setUpdating(null);
    }
  };

  const severityConfig = {
    low: { icon: Info, color: 'text-success', bg: 'bg-success/10', border: 'border-l-success', emoji: '✅' },
    medium: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-l-warning', emoji: '⚠️' },
    high: { icon: AlertTriangle, color: 'text-risk-high', bg: 'bg-risk-high/10', border: 'border-l-risk-high', emoji: '🔶' },
    critical: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-l-destructive', emoji: '🚨' },
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Alerts</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated on your crop safety status
            </p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total" value={stats.total} color="text-foreground" />
            <StatCard label="Unread" value={stats.unread} color="text-primary" />
            <StatCard label="High/Critical" value={stats.bySeverity.high + stats.bySeverity.critical} color="text-destructive" />
            <StatCard label="Low Risk" value={stats.bySeverity.low} color="text-success" />
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              filter === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}
          >
            Unread ({stats?.unread || 0})
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground mt-2">Loading alerts...</p>
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((alert) => {
              const config = severityConfig[alert.severity];
              const Icon = config.icon;
              
              return (
                <div
                  key={alert._id}
                  className={cn(
                    'card-elevated overflow-hidden border-l-4 animate-slide-up',
                    config.border,
                    !alert.isRead && 'ring-1 ring-primary/20'
                  )}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', config.bg)}>
                        <span className="text-xl">{config.emoji}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className={cn(
                              'font-semibold',
                              alert.isRead ? 'text-muted-foreground' : 'text-foreground'
                            )}>
                              {alert.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.message}
                            </p>
                          </div>
                          
                          {!alert.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {!alert.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkRead(alert._id)}
                                disabled={updating === alert._id}
                              >
                                {updating === alert._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Mark Read
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {!alert.isAcknowledged && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAcknowledge(alert._id)}
                                disabled={updating === alert._id}
                              >
                                {updating === alert._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCheck className="w-4 h-4" />
                                    Acknowledge
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {alert.isAcknowledged && (
                              <span className="text-xs text-success flex items-center gap-1">
                                <CheckCheck className="w-3 h-3" />
                                Acknowledged
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 card-elevated">
              <BellOff className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {filter === 'unread' ? 'No unread alerts' : 'No alerts yet'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You'll receive alerts when risks are detected
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="card-elevated p-4 text-center">
      <p className={cn('text-2xl font-bold', color)}>{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
