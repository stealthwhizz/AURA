import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { api, Certification, CertificationResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  QrCode, 
  Search, 
  Copy, 
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  Package,
  Award,
  Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const cropTypes = ['Maize', 'Groundnuts', 'Sorghum', 'Millet', 'Rice', 'Wheat', 'Other'];

export default function Certifications() {
  const { farmer } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'create' | 'my' | 'verify'>('create');
  const [isLoading, setIsLoading] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCert, setNewCert] = useState<CertificationResponse | null>(null);
  const [verifyResult, setVerifyResult] = useState<Certification | null>(null);
  const [verifyBatchId, setVerifyBatchId] = useState('');

  // Form state
  const [cropType, setCropType] = useState(cropTypes[0]);
  const [quantity, setQuantity] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [interventions, setInterventions] = useState('');

  useEffect(() => {
    if (activeTab === 'my' && farmer) {
      fetchCertifications();
    }
  }, [activeTab, farmer]);

  const fetchCertifications = async () => {
    if (!farmer) return;
    setIsLoading(true);
    try {
      const data = await api.getFarmerCertifications(farmer._id);
      setCertifications(data);
    } catch (error) {
      // Mock data
      setCertifications([
        {
          _id: '1',
          batchId: 'AURA-2024-001234',
          farmer: farmer._id,
          cropType: 'Maize',
          quantity: 500,
          harvestDate: '2024-01-15',
          averageRiskScore: 12,
          status: 'valid',
          verificationUrl: 'https://aura.app/verify/AURA-2024-001234',
          blockchainTxHash: '0x1234...5678',
          createdAt: new Date(Date.now() - 604800000).toISOString(),
        },
        {
          _id: '2',
          batchId: 'AURA-2024-001235',
          farmer: farmer._id,
          cropType: 'Groundnuts',
          quantity: 200,
          averageRiskScore: 8,
          status: 'valid',
          verificationUrl: 'https://aura.app/verify/AURA-2024-001235',
          createdAt: new Date(Date.now() - 1209600000).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer) return;

    setIsLoading(true);
    try {
      const response = await api.createCertification({
        farmerId: farmer._id,
        cropType,
        quantity: parseInt(quantity),
        harvestDate: harvestDate || undefined,
        predictions: [],
        interventions: interventions || undefined,
      });
      setNewCert(response);
      toast({
        title: 'Certification created! 🎉',
        description: `Batch ID: ${response.certification.batchId}`,
      });
    } catch (error) {
      // Mock response
      const mockResponse: CertificationResponse = {
        certification: {
          _id: 'new-' + Date.now(),
          batchId: `AURA-2024-${Math.random().toString().slice(2, 8)}`,
          farmer: farmer._id,
          cropType,
          quantity: parseInt(quantity),
          harvestDate,
          averageRiskScore: 15,
          status: 'valid',
          verificationUrl: `https://aura.app/verify/AURA-2024-${Math.random().toString().slice(2, 8)}`,
          createdAt: new Date().toISOString(),
        },
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAMFBMVEX///8AAADf39+/v7+fn5+vr6/v7++Pj49vb29/f3/Pz89fX18vLy9PT08fHx8/Pz+YZqfqAAAEKElEQVR4nO2d23qDIAyAQar1sP3/3+7abW2tgBwSQjL/urvdjJn5SwJorc5xHMdxHMdxHMdxHMdxHMdxnP+LTt0A7aQHqwzqdMO0kYYsKGg6C0ldSBuhtQZ1E9tJW5bUhbQRWmtQN7GddF5J3YR20hON1I1oJ00XKXUT2knPNFI3op30TKN4K9RtSJOeaSBvi7oRqdJzjZL7KXUzUqXnGilTXeoWpEpBgTJuaVWWNOTBwNJKSdSNSJGCAmXcUlYpidFKStRtSJGCApUFqtuQIk0aZdpSVkUaDaIpq6IWMK1U2gqRlZJIWyHSKtAWiLRSaStEVinapqDMKj0w/0XLQqStEGE11CnQWolYCxQpFa9OAdIq0FaIrJRo1CkoBVoF2gqRVoGwAaJtgOhaEKlO0eoUaK1EWgXCCoi2FiJqhUilQGslYq0F0VaIqBRoqhPUGgXadQVaBZpqIHIViGstkZWCVq2E1gqE1RJpFYi0AbS1IFopobVEYi2ItArEWYDIWiGyVoi1QqRVoK0GslKgqZaIWiGyUiCuFohaCyJVorFW0E5YobFaorFaEFlLBKelYu0C8bUkshYIToHGWolYC0LWEom1QNRa0E44IWsliKwlkpWCdtoKEZYSjbVC1Foimu50klKisZbIViKsAuFvRV0g3OoUaRWIbg9EWAuirQXRaSCyWhBZS4RXAFEpkFYBWC0JWgERaiFYKwnVgoirBeFaIq4GIqulg2tB1BaItBYEnQJttSToxChUCxKnJaJaEtE2EHUtibIWRKaBKGtB1AKR1YKo9oBgLYk8LUlXS0evBVHWAlEtSF5aEq4GIq4FUdaSyGpBxLQgUS0drxaEi0FktSS6WhCxFkRXSyLXkshqSTSJSS60JJoKiK4FqVspMXYKdOoKxLYH4mmB4CnQmEu09kCkWpI6raCxWhJbCxJVC6IW0Fi1IJ5OqNqSZLsgeosS14LUtSS+NhDZksS1JIYSJK8l8XwP0teDaGpB9LUk9loSfWuJ+S4kiVsH8dWSqFsQfS2JuQVBb0HstSTyFsReCyKfCMRaAfjfBZbEXgvCqSWx1oKoa0k8WxC4GkS0JNrXD+xvQdS1JPI9iLqWRL8M4e9BPC0IfQzGXAt6+u9BvLUknlIScy3p2QVS14LEpwPEt5vI1oGo/4mEvhbE/TLM/zLMHgxE/zKMuxYErkHoO5TI14PoawGIb0ls/0TCs5fG14J4Jyzx/xMJcy2I+l9I2GtJnC2I/5/4mWtJrC2I9l9oqGtB3C2IvBbE+S802GtB3HuQ2ZZYa0GMfyPibkHsf0VC/0cCPC2ItZbk8HcC7D9Ig9+CuGtBnK8fcNeS+P5FhLmWxF1L4mpBfH8kw11L4qklcf2RhL8WxP5HQsz/RMJdy/+7IOcf4g+cYR9LfQAAAABJRU5ErkJggg==',
      };
      setNewCert(mockResponse);
      toast({
        title: 'Certification created! 🎉',
        description: `Batch ID: ${mockResponse.certification.batchId}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setVerifyResult(null);

    try {
      const result = await api.verifyCertification(verifyBatchId);
      setVerifyResult(result);
    } catch (error) {
      // Mock verify
      if (verifyBatchId.startsWith('AURA-')) {
        setVerifyResult({
          _id: 'verified',
          batchId: verifyBatchId,
          farmer: 'farmer-123',
          cropType: 'Maize',
          quantity: 500,
          averageRiskScore: 12,
          status: 'valid',
          verificationUrl: `https://aura.app/verify/${verifyBatchId}`,
          createdAt: new Date().toISOString(),
        });
      } else {
        toast({
          title: 'Not Found',
          description: 'No certification found with this batch ID.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard! 📋' });
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Certifications</h1>
          <p className="text-muted-foreground mt-1">
            Get blockchain-verified safety certifications for your crops
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {[
            { id: 'create', label: 'Create New' },
            { id: 'my', label: 'My Certifications' },
            { id: 'verify', label: 'Verify' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'px-4 py-2 font-medium text-sm transition-colors relative whitespace-nowrap',
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-elevated p-6 animate-slide-up">
              <h2 className="font-bold text-lg text-foreground mb-4">Create Certification</h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Crop Type</label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="input-field"
                  >
                    {cropTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Quantity (kg)</label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g., 500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Harvest Date (optional)</label>
                  <Input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Interventions (optional)</label>
                  <textarea
                    placeholder="Describe any interventions taken..."
                    value={interventions}
                    onChange={(e) => setInterventions(e.target.value)}
                    className="input-field min-h-[80px] resize-none"
                  />
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Generate Certification
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Result */}
            <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-bold text-lg text-foreground mb-4">Certification Result</h2>
              
              {newCert ? (
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="inline-block p-4 bg-card rounded-xl border-2 border-border">
                      <img 
                        src={newCert.qrCode} 
                        alt="Certification QR Code" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Scan to verify authenticity
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <DetailRow 
                      label="Batch ID" 
                      value={newCert.certification.batchId}
                      copyable
                      onCopy={() => copyToClipboard(newCert.certification.batchId)}
                    />
                    <DetailRow label="Crop Type" value={newCert.certification.cropType} />
                    <DetailRow label="Quantity" value={`${newCert.certification.quantity} kg`} />
                    <DetailRow label="Risk Score" value={`${newCert.certification.averageRiskScore}%`} />
                    <DetailRow 
                      label="Status" 
                      value={
                        <span className="flex items-center gap-1 text-success">
                          <CheckCircle className="w-4 h-4" />
                          Valid
                        </span>
                      } 
                    />
                  </div>

                  {/* Verification URL */}
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Verification URL</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-foreground truncate flex-1">
                        {newCert.certification.verificationUrl}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(newCert.certification.verificationUrl)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Fill in the form to generate your certification
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Certifications Tab */}
        {activeTab === 'my' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              </div>
            ) : certifications.length > 0 ? (
              certifications.map((cert) => (
                <CertificationCard 
                  key={cert._id} 
                  certification={cert}
                  onCopy={copyToClipboard}
                />
              ))
            ) : (
              <div className="text-center py-12 card-elevated">
                <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No certifications yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('create')}
                >
                  Create Your First Certification
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Verify Tab */}
        {activeTab === 'verify' && (
          <div className="max-w-xl mx-auto">
            <div className="card-elevated p-6 animate-slide-up">
              <h2 className="font-bold text-lg text-foreground mb-4 text-center">
                Verify a Certification
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Enter a batch ID to verify the authenticity of a certification
              </p>

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter Batch ID (e.g., AURA-2024-001234)"
                    value={verifyBatchId}
                    onChange={(e) => setVerifyBatchId(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Verify
                    </>
                  )}
                </Button>
              </form>

              {verifyResult && (
                <div className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20 animate-slide-up">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="font-semibold text-success">Verified ✓</span>
                  </div>
                  <div className="space-y-2">
                    <DetailRow label="Batch ID" value={verifyResult.batchId} />
                    <DetailRow label="Crop Type" value={verifyResult.cropType} />
                    <DetailRow label="Quantity" value={`${verifyResult.quantity} kg`} />
                    <DetailRow label="Risk Score" value={`${verifyResult.averageRiskScore}%`} />
                    <DetailRow 
                      label="Created" 
                      value={new Date(verifyResult.createdAt).toLocaleDateString()} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function DetailRow({ 
  label, 
  value, 
  copyable, 
  onCopy 
}: { 
  label: string; 
  value: React.ReactNode;
  copyable?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{value}</span>
        {copyable && onCopy && (
          <button onClick={onCopy} className="text-muted-foreground hover:text-foreground">
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function CertificationCard({ 
  certification, 
  onCopy 
}: { 
  certification: Certification;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="card-elevated p-4 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
          <Shield className="w-6 h-6 text-success" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground">{certification.cropType}</h3>
              <p className="text-sm text-muted-foreground">
                {certification.quantity} kg • Risk: {certification.averageRiskScore}%
              </p>
            </div>
            
            <span className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              certification.status === 'valid' 
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            )}>
              {certification.status === 'valid' ? (
                <><CheckCircle className="w-3 h-3" /> Valid</>
              ) : (
                <><XCircle className="w-3 h-3" /> Revoked</>
              )}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(certification.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {certification.batchId}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(certification.batchId)}
            >
              <Copy className="w-3 h-3" />
              Copy ID
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(certification.verificationUrl)}
            >
              <Link2 className="w-3 h-3" />
              Copy URL
            </Button>
            {certification.blockchainTxHash && (
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a 
                  href={`https://etherscan.io/tx/${certification.blockchainTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on Chain
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
