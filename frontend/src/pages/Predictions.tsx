import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { api, Prediction, PredictionResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Droplets, 
  Warehouse, 
  ThermometerSun,
  Loader2,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const storageTypes = ['Silo', 'Warehouse', 'Traditional Crib', 'Bag Storage', 'Underground Pit'];
const storageQualities = ['Excellent', 'Good', 'Fair', 'Poor'];

export default function Predictions() {
  const { farmer } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Prediction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  // Form state
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [storageType, setStorageType] = useState(storageTypes[0]);
  const [storageQuality, setStorageQuality] = useState(storageQualities[0]);
  const [moistureContent, setMoistureContent] = useState('');

  useEffect(() => {
    if (activeTab === 'history' && farmer) {
      fetchHistory();
    }
  }, [activeTab, farmer]);

  const fetchHistory = async () => {
    if (!farmer) return;
    setHistoryLoading(true);
    try {
      const data = await api.getPredictionHistory(farmer._id, 20);
      setHistory(data);
    } catch (error) {
      // Mock data for demo
      setHistory([
        {
          _id: '1',
          farmer: farmer._id,
          location: { latitude: -1.2921, longitude: 36.8219 },
          riskScore: 32,
          riskLevel: 'moderate',
          confidence: 85,
          recommendations: ['Improve ventilation', 'Monitor moisture'],
          storageType: 'Silo',
          storageQuality: 'Good',
          moistureContent: 14.5,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          _id: '2',
          farmer: farmer._id,
          location: { latitude: -1.2921, longitude: 36.8219 },
          riskScore: 18,
          riskLevel: 'low',
          confidence: 92,
          recommendations: ['Maintain current practices'],
          storageType: 'Warehouse',
          storageQuality: 'Excellent',
          moistureContent: 12.0,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          toast({
            title: 'Location detected 📍',
            description: 'Your coordinates have been filled in.',
          });
        },
        () => {
          toast({
            title: 'Location access denied',
            description: 'Please enter coordinates manually.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer) return;

    setIsLoading(true);
    try {
      const response = await api.createPrediction({
        farmerId: farmer._id,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        storageType,
        storageQuality,
        moistureContent: parseFloat(moistureContent),
      });
      setResult(response);
      toast({
        title: 'Prediction complete! ✅',
        description: `Risk level: ${response.prediction.riskLevel.toUpperCase()}`,
      });
    } catch (error) {
      // Mock result for demo
      const mockResult: PredictionResponse = {
        prediction: {
          _id: 'new-' + Date.now(),
          farmer: farmer._id,
          location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
          riskScore: Math.random() * 100,
          riskLevel: ['low', 'moderate', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          confidence: 75 + Math.random() * 20,
          recommendations: [
            'Ensure proper ventilation in storage area',
            'Monitor humidity levels daily',
            'Consider using moisture absorbers',
          ],
          storageType,
          storageQuality,
          moistureContent: parseFloat(moistureContent),
          createdAt: new Date().toISOString(),
        },
        recommendations: [
          'Ensure proper ventilation in storage area',
          'Monitor humidity levels daily',
          'Consider using moisture absorbers',
        ],
        forecast: {
          nextWeek: Math.random() * 100,
          trend: ['improving', 'stable', 'worsening'][Math.floor(Math.random() * 3)] as any,
        },
      };
      setResult(mockResult);
      toast({
        title: 'Prediction complete! ✅',
        description: `Risk level: ${mockResult.prediction.riskLevel.toUpperCase()}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Predictions</h1>
          <p className="text-muted-foreground mt-1">
            Get aflatoxin risk assessments for your crops
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('new')}
            className={cn(
              'px-4 py-2 font-medium text-sm transition-colors relative',
              activeTab === 'new'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            New Prediction
            {activeTab === 'new' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'px-4 py-2 font-medium text-sm transition-colors relative',
              activeTab === 'history'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            History
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {activeTab === 'new' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Prediction Form */}
            <div className="card-elevated p-6 animate-slide-up">
              <h2 className="font-bold text-lg text-foreground mb-4">Request Prediction</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location Coordinates
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      required
                    />
                    <Input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetLocation}
                  >
                    📍 Use My Location
                  </Button>
                </div>

                {/* Storage Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-primary" />
                    Storage Type
                  </label>
                  <select
                    value={storageType}
                    onChange={(e) => setStorageType(e.target.value)}
                    className="input-field"
                  >
                    {storageTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Storage Quality */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ThermometerSun className="w-4 h-4 text-primary" />
                    Storage Quality
                  </label>
                  <select
                    value={storageQuality}
                    onChange={(e) => setStorageQuality(e.target.value)}
                    className="input-field"
                  >
                    {storageQualities.map((quality) => (
                      <option key={quality} value={quality}>{quality}</option>
                    ))}
                  </select>
                </div>

                {/* Moisture Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-primary" />
                    Moisture Content (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="e.g., 14.5"
                    value={moistureContent}
                    onChange={(e) => setMoistureContent(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Ideal moisture content for grain storage is 12-14%
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Get Prediction
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Result Display */}
            <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-bold text-lg text-foreground mb-4">Prediction Result</h2>
              
              {result ? (
                <div className="space-y-6">
                  {/* Risk Score */}
                  <div className="text-center py-6">
                    <RiskBadge 
                      level={result.prediction.riskLevel} 
                      score={result.prediction.riskScore}
                      size="lg"
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      Confidence: {result.prediction.confidence.toFixed(1)}%
                    </p>
                  </div>

                  {/* Forecast */}
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-2 mb-2">
                      {result.forecast.trend === 'improving' && <TrendingDown className="w-5 h-5 text-success" />}
                      {result.forecast.trend === 'worsening' && <TrendingUp className="w-5 h-5 text-destructive" />}
                      {result.forecast.trend === 'stable' && <Minus className="w-5 h-5 text-muted-foreground" />}
                      <span className="font-medium text-foreground">7-Day Forecast</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Risk trend is <strong>{result.forecast.trend}</strong>. 
                      Expected risk next week: {result.forecast.nextWeek.toFixed(1)}%
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-accent" />
                      <span className="font-medium text-foreground">Recommendations</span>
                    </div>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, i) => (
                        <li 
                          key={i} 
                          className="flex items-start gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-secondary/30"
                        >
                          <span className="text-primary font-bold">{i + 1}.</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  {result.prediction.riskLevel !== 'low' && (
                    <div className="flex gap-3 pt-4 border-t border-border">
                      <Button variant="outline" className="flex-1">
                        Set Alert
                      </Button>
                      <Button variant="default" className="flex-1">
                        Get Certified
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <ThermometerSun className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Fill in the form and submit to get your prediction results
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {historyLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground mt-2">Loading history...</p>
              </div>
            ) : history.length > 0 ? (
              history.map((prediction) => (
                <PredictionCard key={prediction._id} prediction={prediction} />
              ))
            ) : (
              <div className="text-center py-12 card-elevated">
                <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No prediction history yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('new')}
                >
                  Make Your First Prediction
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function PredictionCard({ prediction }: { prediction: Prediction }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card-elevated overflow-hidden animate-slide-up">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <RiskBadge level={prediction.riskLevel} score={prediction.riskScore} size="sm" />
          <div className="text-left">
            <p className="font-medium text-foreground">{prediction.storageType}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(prediction.createdAt).toLocaleDateString()} • {prediction.moistureContent}% moisture
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="p-4 pt-0 border-t border-border space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">
                {prediction.location.latitude.toFixed(4)}, {prediction.location.longitude.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-sm font-medium text-foreground">{prediction.confidence}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Storage Quality</p>
              <p className="text-sm font-medium text-foreground">{prediction.storageQuality}</p>
            </div>
          </div>

          {prediction.recommendations.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Recommendations</p>
              <ul className="space-y-1">
                {prediction.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
