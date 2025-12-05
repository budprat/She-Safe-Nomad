import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  AlertTriangle,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminStats } from '@/hooks/useIsAdmin';

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    {
      title: 'Pending Moderation',
      value: stats?.pendingModeration || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      link: '/admin/moderation',
    },
    {
      title: 'Active SOS Alerts',
      value: stats?.activeAlerts || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      urgent: (stats?.activeAlerts || 0) > 0,
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/users',
    },
    {
      title: 'Safety Reports',
      value: stats?.totalReports || 0,
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          </div>
          <p className="text-lg text-slate-600">
            Manage moderation, users, and monitor platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card
              key={stat.title}
              className={`${stat.urgent ? 'ring-2 ring-red-500 animate-pulse' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {isLoading ? '...' : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                {stat.link && (
                  <Link
                    to={stat.link}
                    className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
                  >
                    View details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/moderation">
                <Button className="w-full justify-between" variant="outline">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Review Moderation Queue
                  </span>
                  {(stats?.pendingModeration || 0) > 0 && (
                    <Badge variant="destructive">
                      {stats?.pendingModeration}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button className="w-full justify-between" variant="outline">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button className="w-full justify-between" variant="outline">
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </span>
                <Badge variant="secondary">Coming Soon</Badge>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  icon={<CheckCircle className="h-4 w-4 text-emerald-600" />}
                  title="Report Approved"
                  description="Safety report for 'Central Park Area' was approved"
                  time="2 minutes ago"
                />
                <ActivityItem
                  icon={<XCircle className="h-4 w-4 text-red-600" />}
                  title="Report Rejected"
                  description="Spam report was removed from the queue"
                  time="15 minutes ago"
                />
                <ActivityItem
                  icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
                  title="SOS Alert Resolved"
                  description="Emergency alert was marked as false alarm"
                  time="1 hour ago"
                />
                <ActivityItem
                  icon={<Users className="h-4 w-4 text-blue-600" />}
                  title="New User Verified"
                  description="User upgraded to 'Verified Traveler' status"
                  time="2 hours ago"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">
              Moderation Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-emerald-600">Approve If:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>- Content is safety-related and factual</li>
                  <li>- Location information is accurate</li>
                  <li>- No personal attacks or hate speech</li>
                  <li>- Photos are appropriate and relevant</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-600">Reject If:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>- Content is spam or promotional</li>
                  <li>- Contains inappropriate material</li>
                  <li>- Location is clearly false</li>
                  <li>- Violates community guidelines</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-600">Escalate If:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>- Legal concerns or threats</li>
                  <li>- Repeated violations by user</li>
                  <li>- Uncertain about decision</li>
                  <li>- High-profile location involved</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, description, time }) => (
  <div className="flex items-start space-x-3">
    <div className="mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <p className="text-sm text-slate-600 truncate">{description}</p>
    </div>
    <span className="text-xs text-slate-400 whitespace-nowrap">{time}</span>
  </div>
);

export default AdminDashboard;
