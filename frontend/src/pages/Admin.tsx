import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Users, Database } from 'lucide-react';

export default function Admin() {
    const { farmer } = useAuth();

    return (
        <Layout>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground">System management and user overview</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card-elevated p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">User Management</h3>
                                <p className="text-sm text-muted-foreground">Manage farmers & admins</p>
                            </div>
                        </div>
                        <p className="text-2xl font-bold">12</p>
                    </div>

                    <div className="card-elevated p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Database className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">System Logs</h3>
                                <p className="text-sm text-muted-foreground">View activity logs</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-success">
                            <span className="w-2 h-2 rounded-full bg-success"></span>
                            System Healthy
                        </div>
                    </div>

                    <div className="card-elevated p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-warning" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Permissions</h3>
                                <p className="text-sm text-muted-foreground">Role configuration</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Standard Policy Active</p>
                    </div>
                </div>

                <div className="card-elevated p-6">
                    <h2 className="text-xl font-bold mb-4">Admin Actions</h2>
                    <div className="text-sm text-muted-foreground">
                        <p>Welcome, {farmer?.name}. You have full access to the system.</p>
                        <p className="mt-2">Use the specific tools in the sidebar to manage certifications and predictions.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
