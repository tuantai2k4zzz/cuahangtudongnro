'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  Package,
  KeyRound,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  Clock,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ticketsApi } from '@/lib/api-client';
import { UserRole } from '@tudongnro/shared-types';

export interface SystemNotification {
  id: string;
  type: 'ORDER' | 'LICENSE' | 'UPDATE' | 'MAINTENANCE' | 'SUPPORT';
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
  ticketId?: string;
}

const NOTIF_STORAGE_KEY = 'tudongnro_notifications';

export function NotificationBell() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<SystemNotification[]>([]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Load stored notifications from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch {
      setNotifications([]);
    }
  }, []);

  // Save to localStorage whenever notifications change
  React.useEffect(() => {
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Listen to custom system notification events (from live chat, order updates, etc.)
  React.useEffect(() => {
    const handleSystemNotification = (event: Event) => {
      const customEvent = event as CustomEvent<Partial<SystemNotification>>;
      if (!customEvent.detail) return;

      const newNotif: SystemNotification = {
        id: customEvent.detail.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: customEvent.detail.type || 'SUPPORT',
        title: customEvent.detail.title || 'Thông báo mới',
        content: customEvent.detail.content || '',
        createdAt: customEvent.detail.createdAt || 'Vừa xong',
        isRead: false,
        link: customEvent.detail.link,
      };

      setNotifications((prev) => {
        // Prevent exact duplicates
        const exists = prev.some(
          (n) => n.id === newNotif.id || (n.title === newNotif.title && n.content === newNotif.content)
        );
        if (exists) return prev;
        return [newNotif, ...prev].slice(0, 30);
      });
    };

    window.addEventListener('add-system-notification', handleSystemNotification);
    return () => window.removeEventListener('add-system-notification', handleSystemNotification);
  }, []);

  // Periodic check for Admin: notify about open tickets
  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.ADMIN) return;

    let isSubscribed = true;
    const checkAdminTickets = async () => {
      try {
        const res = await ticketsApi.getAllAdmin({ status: 'OPEN' });
        if (!isSubscribed || !res.data) return;

        const openTickets = res.data;
        if (openTickets.length > 0) {
          const latest = openTickets[0];
          const ticketId = latest.id || (latest as any)._id;
          const notifId = `ticket_open_${ticketId}`;

          setNotifications((prev) => {
            if (prev.some((n) => n.id === notifId)) return prev;
            const newNotif: SystemNotification = {
              id: notifId,
              type: 'SUPPORT',
              title: `Yêu cầu hỗ trợ mới [${latest.ticketCode}]`,
              content: `${latest.customerName}: ${latest.subject}`,
              createdAt: 'Cần hỗ trợ',
              isRead: false,
              link: '/admin',
              ticketId,
            };
            return [newNotif, ...prev].slice(0, 30);
          });
        }
      } catch {}
    };

    checkAdminTickets();
    const interval = setInterval(checkAdminTickets, 10000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, user?.role]);

  // Periodic check for Customer: notify about Admin replies to tickets
  React.useEffect(() => {
    let isSubscribed = true;

    const checkCustomerTickets = async () => {
      try {
        // If logged in customer
        if (isAuthenticated && user?.role !== UserRole.ADMIN) {
          const res = await ticketsApi.getMyTickets();
          if (!isSubscribed || !res.data) return;

          res.data.forEach((ticket) => {
            const ticketId = ticket.id || (ticket as any)._id;
            const adminMsgs = ticket.messages?.filter((m) => m.sender === 'ADMIN') || [];
            if (adminMsgs.length > 0) {
              const lastAdminMsg = adminMsgs[adminMsgs.length - 1];
              const notifId = `reply_${ticketId}_${new Date(lastAdminMsg.createdAt).getTime()}`;

              setNotifications((prev) => {
                if (prev.some((n) => n.id === notifId)) return prev;
                const newNotif: SystemNotification = {
                  id: notifId,
                  type: 'SUPPORT',
                  title: `Kỹ thuật viên phản hồi [${ticket.ticketCode}]`,
                  content: lastAdminMsg.message,
                  createdAt: 'Vừa xong',
                  isRead: false,
                  link: '#support-widget',
                  ticketId,
                };
                return [newNotif, ...prev].slice(0, 30);
              });
            }
          });
        } else if (!isAuthenticated) {
          // If guest, check stored ticket ID
          const storedId = localStorage.getItem('tudongnro_active_ticket_id');
          if (storedId) {
            const res = await ticketsApi.getById(storedId);
            if (!isSubscribed || !res.data) return;
            const ticket = res.data;
            const ticketId = ticket.id || (ticket as any)._id;
            const adminMsgs = ticket.messages?.filter((m) => m.sender === 'ADMIN') || [];
            if (adminMsgs.length > 0) {
              const lastAdminMsg = adminMsgs[adminMsgs.length - 1];
              const notifId = `reply_${ticketId}_${new Date(lastAdminMsg.createdAt).getTime()}`;

              setNotifications((prev) => {
                if (prev.some((n) => n.id === notifId)) return prev;
                const newNotif: SystemNotification = {
                  id: notifId,
                  type: 'SUPPORT',
                  title: `Kỹ thuật viên phản hồi [${ticket.ticketCode}]`,
                  content: lastAdminMsg.message,
                  createdAt: 'Vừa xong',
                  isRead: false,
                  link: '#support-widget',
                  ticketId,
                };
                return [newNotif, ...prev].slice(0, 30);
              });
            }
          }
        }
      } catch {}
    };

    checkCustomerTickets();
    const interval = setInterval(checkCustomerTickets, 6000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, user?.role]);

  // Click outside to close
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    try {
      localStorage.removeItem(NOTIF_STORAGE_KEY);
    } catch {}
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleNotificationClick = (n: SystemNotification) => {
    markAsRead(n.id);
    setIsOpen(false);

    if (n.link === '#support-widget' || (n.type === 'SUPPORT' && user?.role !== UserRole.ADMIN)) {
      const targetTicketId = n.ticketId || (typeof window !== 'undefined' ? localStorage.getItem('tudongnro_active_ticket_id') : null);
      if (targetTicketId && typeof window !== 'undefined') {
        localStorage.setItem('tudongnro_active_ticket_id', targetTicketId);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('open-support-widget', {
            detail: { ticketId: targetTicketId },
          })
        );
      }
    } else if (n.link) {
      router.push(n.link);
    }
  };

  const getIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'ORDER':
        return <Package className="h-4 w-4 text-emerald-400" />;
      case 'LICENSE':
        return <KeyRound className="h-4 w-4 text-amber-400" />;
      case 'UPDATE':
        return <Sparkles className="h-4 w-4 text-cyan-400" />;
      case 'MAINTENANCE':
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case 'SUPPORT':
        return <MessageSquare className="h-4 w-4 text-cyan-400" />;
      default:
        return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Thông báo hệ thống"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-lg shadow-rose-500/50 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-[#0C111D]/95 backdrop-blur-xl p-3 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Thông Báo
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                  {unreadCount} mới
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckCheck className="h-3 w-3" /> Đã đọc
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Xóa tất cả thông báo"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 my-1 pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                <Bell className="h-6 w-6 text-slate-600 opacity-40" />
                <p className="font-medium text-slate-400">Chưa có thông báo nào</p>
                <p className="text-[10px] text-slate-600">
                  Các phản hồi hỗ trợ và cập nhật đơn hàng sẽ xuất hiện tại đây.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                    n.isRead
                      ? 'hover:bg-slate-800/30 opacity-70'
                      : 'bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/30'
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800/90 border border-slate-700/60">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold text-white truncate">{n.title}</h4>
                      {!n.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_#22d3ee]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {n.content}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {n.createdAt}
                      </span>
                      {n.link && (
                        <span className="text-[10px] text-cyan-400 hover:underline font-medium">
                          {n.link === '#support-widget' ? 'Mở chat →' : 'Xem chi tiết →'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-800/80 pt-2 text-center">
            <Link
              href="/status"
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-slate-500 hover:text-cyan-400 transition-colors"
            >
              Kiểm tra trạng thái máy chủ tự động →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

