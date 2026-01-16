import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
    Shield,
    UserPlus,
    Mail,
    Lock,
    Users,
    Trash2,
    AlertCircle
} from 'lucide-react';

interface Admin {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminManagement() {
    const { farmer } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [admins, setAdmins] = useState<Admin[]>([]);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        // In a real app, you'd fetch admin users from the API
        // For now, we'll show a placeholder
        setAdmins([
            {
                _id: farmer?._id || '',
                name: farmer?.name || '',
                email: farmer?.email || '',
                role: 'Super Admin',
                createdAt: farmer?.createdAt || new Date().toISOString()
            }
        ]);
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    phone: '0000000000', // Placeholder
                    role: 'admin',
                    location: { latitude: 0, longitude: 0 },
                    crops: []
                })
            });

            if (!response.ok) throw new Error('Failed to create admin');

            toast({
                title: 'Admin Created! ✅',
                description: `New admin ${name} has been added.`,
            });

            setName('');
            setEmail('');
            setPassword('');
            fetchAdmins();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create admin. Email may already exist.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (farmer?.role !== 'admin') {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-muted-foreground">
                        Only administrators can access this page.
                    </p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6 max-w-4xl">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        Admin Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage system administrators
                    </p>
                </div>

                {/* Create Admin Form */}
                <div className="card-elevated p-6">
                    <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Create New Admin
                    </h2>

                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Admin name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    placeholder="Secure password"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="gradient"
                            className="w-full"
                            disabled={isLoading}
                        >
                            <UserPlus className="w-4 h-4" />
                            Create Admin
                        </Button>
                    </form>
                </div>

                {/* Admin List */}
                <div className="card-elevated p-6">
                    <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Current Administrators
                    </h2>

                    <div className="space-y-3">
                        {admins.map((admin) => (
                            <div
                                key={admin._id}
                                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{admin.name}</p>
                                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                        {admin.role}
                                    </span>
                                    {admin._id !== farmer?._id && (
                                        <Button variant="ghost" size="sm" className="text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
