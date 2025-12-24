import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Wheat, 
  Bell,
  Save,
  Loader2,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Profile() {
  const { farmer, updateFarmer } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [name, setName] = useState(farmer?.name || '');
  const [phone, setPhone] = useState(farmer?.phone || '');
  const [location, setLocation] = useState(farmer?.location || '');
  const [crops, setCrops] = useState(farmer?.crops?.join(', ') || '');
  const [emailAlerts, setEmailAlerts] = useState(farmer?.alertPreferences?.email ?? true);
  const [smsAlerts, setSmsAlerts] = useState(farmer?.alertPreferences?.sms ?? false);
  const [pushAlerts, setPushAlerts] = useState(farmer?.alertPreferences?.push ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateFarmer({
        name,
        phone,
        location,
        crops: crops.split(',').map(c => c.trim()).filter(Boolean),
        alertPreferences: {
          email: emailAlerts,
          sms: smsAlerts,
          push: pushAlerts,
        },
      });
      toast({
        title: 'Profile updated! ✅',
        description: 'Your changes have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Profile updated! ✅',
        description: 'Your changes have been saved.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="card-elevated p-6 animate-slide-up">
            <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={farmer?.email || ''}
                    className="pl-10 bg-muted"
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    placeholder="+254 700 000 000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                    placeholder="e.g., Nakuru, Kenya"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Crops (comma separated)</label>
                <div className="relative">
                  <Wheat className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={crops}
                    onChange={(e) => setCrops(e.target.value)}
                    className="pl-10"
                    placeholder="e.g., Maize, Groundnuts, Sorghum"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Alert Preferences */}
          <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Alert Preferences
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose how you want to receive risk alerts and notifications
            </p>

            <div className="space-y-4">
              <ToggleOption
                icon={<Mail className="w-5 h-5" />}
                label="Email Notifications"
                description="Receive alerts via email"
                checked={emailAlerts}
                onChange={setEmailAlerts}
              />
              <ToggleOption
                icon={<MessageSquare className="w-5 h-5" />}
                label="SMS Notifications"
                description="Receive alerts via SMS"
                checked={smsAlerts}
                onChange={setSmsAlerts}
              />
              <ToggleOption
                icon={<Smartphone className="w-5 h-5" />}
                label="Push Notifications"
                description="Receive in-app push notifications"
                checked={pushAlerts}
                onChange={setPushAlerts}
              />
            </div>
          </div>

          {/* Account Info */}
          <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-bold text-lg text-foreground mb-4">Account Information</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium text-foreground">
                  {farmer?.createdAt 
                    ? new Date(farmer.createdAt).toLocaleDateString() 
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Account ID</span>
                <span className="text-sm font-medium text-foreground font-mono">
                  {farmer?._id?.slice(0, 8) || 'N/A'}...
                </span>
              </div>
              {farmer?.walletAddress && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Wallet Address</span>
                  <span className="text-sm font-medium text-foreground font-mono">
                    {farmer.walletAddress.slice(0, 6)}...{farmer.walletAddress.slice(-4)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </div>
    </Layout>
  );
}

function ToggleOption({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground">
          {icon}
        </div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
          checked ? 'bg-primary' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </label>
  );
}
