'use client';

import * as React from 'react';
import {
  MessageCircle,
  X,
  Send,
  HelpCircle,
  ShieldCheck,
  Zap,
  PhoneCall,
  ExternalLink,
  Clock,
  Sparkles,
  Paperclip,
  CheckCircle2,
  Headphones,
  RotateCcw,
  User,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { ticketsApi } from '@/lib/api-client';
import { ISupportTicket, TicketCategory, TicketStatus } from '@tudongnro/shared-types';
import { formatDate } from '@/lib/utils';

const FAQS = [
  {
    q: 'Sau khi chuyển khoản bao lâu thì nhận được key?',
    a: 'Hệ thống quét biến động VietQR tự động 24/7. Key sẽ hiển thị trên màn hình và lưu vào Bảng điều khiển của bạn trong 3 - 10 giây.',
  },
  {
    q: 'Lỗi HWID không khớp máy thì xử lý thế nào?',
    a: 'Bạn vào trang "Quản lý bản quyền" trong tài khoản và nhấn "Reset HWID". Mỗi tháng hệ thống hỗ trợ reset tối đa 3 lần miễn phí.',
  },
  {
    q: 'Tool có bị khóa tài khoản game Ngọc Rồng không?',
    a: 'Tất cả các bản tool của TUDONGNROTT đều sử dụng cơ chế mô phỏng thao tác phím ảo tự nhiên, không can thiệp bộ nhớ RAM, tỉ lệ an toàn 100%.',
  },
];

const ACTIVE_TICKET_STORAGE_KEY = 'tudongnro_active_ticket_id';

export function SupportWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'CHAT' | 'CHANNELS' | 'FAQ'>('CHAT');
  const [category, setCategory] = React.useState<TicketCategory>(TicketCategory.LOI_TOOL);
  const [orderCodeInput, setOrderCodeInput] = React.useState('');
  const [inputText, setInputText] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  // Active ticket loaded from backend
  const [currentTicketId, setCurrentTicketId] = React.useState<string | null>(null);
  const [activeTicket, setActiveTicket] = React.useState<ISupportTicket | null>(null);
  const lastAdminMsgCountRef = React.useRef(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  // Polling / fetching ticket messages from backend
  const syncTicket = React.useCallback(
    async (ticketId: string, isSilent = false) => {
      try {
        const res = await ticketsApi.getById(ticketId);
        if (res.data) {
          const ticketData = res.data;
          setActiveTicket(ticketData);

          // Check for new admin replies
          const adminMsgs = ticketData.messages?.filter((m) => m.sender === 'ADMIN') || [];
          if (adminMsgs.length > lastAdminMsgCountRef.current) {
            const newAdminMsg = adminMsgs[adminMsgs.length - 1];
            lastAdminMsgCountRef.current = adminMsgs.length;

            if (!isSilent) {
              toast.showToast({
                type: 'SUCCESS',
                title: 'Kỹ thuật viên phản hồi',
                message: newAdminMsg.message,
              });

              // Dispatch notification to system notification bell
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('add-system-notification', {
                    detail: {
                      id: `reply_${ticketData.id || (ticketData as any)._id}_${new Date(newAdminMsg.createdAt).getTime()}`,
                      title: `Kỹ thuật viên đã phản hồi [${ticketData.ticketCode}]`,
                      content: newAdminMsg.message,
                      type: 'SUPPORT',
                      link: '#support-widget',
                      ticketId: ticketData.id || (ticketData as any)._id,
                    },
                  })
                );
              }
            }

            if (!isOpen) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        }
      } catch (err: any) {
        if (err?.statusCode === 404) {
          localStorage.removeItem(ACTIVE_TICKET_STORAGE_KEY);
          setCurrentTicketId(null);
          setActiveTicket(null);
        }
      }
    },
    [isOpen, toast]
  );

  // Load stored ticket ID or auto-fetch latest ticket if user is logged in
  React.useEffect(() => {
    const initTicket = async () => {
      try {
        const storedId = localStorage.getItem(ACTIVE_TICKET_STORAGE_KEY);
        if (storedId) {
          setCurrentTicketId(storedId);
          await syncTicket(storedId, true);
          return;
        }

        // Auto-load user's latest ticket if logged in
        if (isAuthenticated && user) {
          const res = await ticketsApi.getMyTickets();
          if (res.data && res.data.length > 0) {
            const latest = res.data[0];
            const latestId = latest.id || (latest as any)._id;
            if (latestId) {
              localStorage.setItem(ACTIVE_TICKET_STORAGE_KEY, latestId);
              setCurrentTicketId(latestId);
              setActiveTicket(latest);
            }
          }
        }
      } catch {}
    };

    initTicket();
  }, [isAuthenticated, user, syncTicket]);

  // Listen to open widget event from notification bell or anywhere
  React.useEffect(() => {
    const handleOpen = async (e?: any) => {
      setIsOpen(true);
      setActiveTab('CHAT');
      setUnreadCount(0);

      const targetId = e?.detail?.ticketId || localStorage.getItem(ACTIVE_TICKET_STORAGE_KEY);
      if (targetId) {
        localStorage.setItem(ACTIVE_TICKET_STORAGE_KEY, targetId);
        setCurrentTicketId(targetId);
        await syncTicket(targetId, true);
      } else if (isAuthenticated && user) {
        try {
          const res = await ticketsApi.getMyTickets();
          if (res.data && res.data.length > 0) {
            const latest = res.data[0];
            const latestId = latest.id || (latest as any)._id;
            if (latestId) {
              localStorage.setItem(ACTIVE_TICKET_STORAGE_KEY, latestId);
              setCurrentTicketId(latestId);
              setActiveTicket(latest);
            }
          }
        } catch {}
      }
    };

    window.addEventListener('open-support-widget', handleOpen);
    return () => window.removeEventListener('open-support-widget', handleOpen);
  }, [isAuthenticated, user, syncTicket]);

  // Time-based greeting
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  }, []);

  // Sync on ticket ID change and set polling interval (faster when open, slower when closed)
  React.useEffect(() => {
    if (!currentTicketId) {
      // If open but no currentTicketId, check if user logged in has a ticket
      if (isOpen && isAuthenticated && user) {
        ticketsApi.getMyTickets().then((res) => {
          if (res.data && res.data.length > 0) {
            const latest = res.data[0];
            const latestId = latest.id || (latest as any)._id;
            if (latestId) {
              localStorage.setItem(ACTIVE_TICKET_STORAGE_KEY, latestId);
              setCurrentTicketId(latestId);
              setActiveTicket(latest);
            }
          }
        }).catch(() => {});
      }
      return;
    }

    // Initial fetch
    syncTicket(currentTicketId, true);

    const intervalTime = isOpen ? 2500 : 7000;
    const interval = setInterval(() => {
      syncTicket(currentTicketId, false);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [currentTicketId, isOpen, isAuthenticated, user, syncTicket]);

  // Auto-scroll to bottom of messages
  React.useEffect(() => {
    if (isOpen && activeTicket?.messages?.length) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTicket?.messages?.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      if (currentTicketId) {
        // Send follow-up message to existing ticket in MongoDB
        await ticketsApi.addMessage(currentTicketId, userMsg);
        await syncTicket(currentTicketId, true);
      } else {
        // Create new ticket in MongoDB
        const created = await ticketsApi.create({
          customerName: user?.fullName || 'Khách vãng lai',
          customerEmail: user?.email || 'guest@gmail.com',
          category,
          orderCode: orderCodeInput || undefined,
          subject: userMsg.substring(0, 60),
          message: userMsg,
        });

        const newId = created.data?.id || (created.data as any)?._id;
        if (newId) {
          localStorage.setItem(ACTIVE_TICKET_STORAGE_KEY, newId);
          setCurrentTicketId(newId);
          setActiveTicket(created.data);
          lastAdminMsgCountRef.current = 0;

          // Dispatch notification to Admin
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('add-system-notification', {
                detail: {
                  title: `Ticket hỗ trợ mới [${created.data.ticketCode}]`,
                  content: `${user?.fullName || 'Khách hàng'}: ${userMsg}`,
                  type: 'SUPPORT',
                  link: '/admin',
                },
              })
            );
          }
        }
      }
    } catch (err: any) {
      toast.showToast({
        type: 'ERROR',
        title: 'Lỗi gửi tin nhắn',
        message: err.message || 'Không thể kết nối tới máy chủ.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNewTicket = () => {
    localStorage.removeItem(ACTIVE_TICKET_STORAGE_KEY);
    setCurrentTicketId(null);
    setActiveTicket(null);
    lastAdminMsgCountRef.current = 0;
    toast.showToast({
      type: 'INFO',
      title: 'Hội thoại mới',
      message: 'Bạn có thể đặt câu hỏi hoặc gửi yêu cầu hỗ trợ mới.',
    });
  };

  const handleSendOrderCodeQuick = () => {
    const code = orderCodeInput || 'NRO-88219';
    setInputText(`Tôi cần hỗ trợ kiểm tra đơn hàng mã: ${code}`);
    toast.info(`Đã điền mã đơn hàng ${code} vào tin nhắn`);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0);
            }}
            aria-label="Hỗ trợ trực tuyến"
            className="group relative flex items-center gap-2.5 rounded-full border border-cyan-500/50 bg-[#0C111D] px-4 py-3 text-white shadow-2xl shadow-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/50 hover:scale-105 transition-all cursor-pointer"
          >
            <div className="relative">
              <MessageCircle className="h-6 w-6 text-cyan-400" />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow">
                  {unreadCount}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                Hỗ Trợ Trực Tuyến
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/40">
                  Online
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Phản hồi trong 1-3 phút</div>
            </div>
          </button>
        )}

        {/* Live Chat Window */}
        {isOpen && (
          <div className="w-[92vw] sm:w-[400px] h-[580px] max-h-[85vh] rounded-3xl border border-slate-700/80 bg-[#0B0F19] shadow-2xl shadow-black flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
            {/* Window Header */}
            <div className="bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Headphones className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                    <span>Hỗ Trợ Kỹ Thuật NRO</span>
                    <Badge variant="success" className="text-[9px] py-0 px-1">
                      24/7
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-cyan-400" />
                    <span>Thời gian phản hồi: 1 - 3 phút</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {activeTicket && (
                  <button
                    onClick={handleCreateNewTicket}
                    title="Tạo yêu cầu mới"
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800/80 bg-slate-950/60 p-1 shrink-0 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('CHAT')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'CHAT'
                    ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Nhắn Tin {activeTicket && `[${activeTicket.ticketCode}]`}
              </button>
              <button
                onClick={() => setActiveTab('CHANNELS')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'CHANNELS'
                    ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Kênh Hỗ Trợ
              </button>
              <button
                onClick={() => setActiveTab('FAQ')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'FAQ'
                    ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Câu Hỏi (FAQ)
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'CHAT' && (
                <div className="flex flex-col h-full justify-between gap-3">
                  {/* Category & Order Code Selector (Only when starting fresh) */}
                  {!activeTicket && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 space-y-2 shrink-0">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Chủ đề cần hỗ trợ:</span>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-cyan-300 font-semibold focus:outline-none"
                        >
                          <option value="THANH_TOAN">Nạp tiền / Quét mã VietQR</option>
                          <option value="LOI_TOOL">Lỗi kích hoạt / HWID</option>
                          <option value="TAI_KHOAN">Tài khoản & Mật khẩu</option>
                          <option value="BAO_HANH">Bảo hành & Gia hạn</option>
                          <option value="KHAC">Vấn đề khác</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Mã đơn hàng (VD: NRO-88219 nếu có)"
                          value={orderCodeInput}
                          onChange={(e) => setOrderCodeInput(e.target.value)}
                          className="h-8 text-xs bg-slate-800/80 border-slate-700/80"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleSendOrderCodeQuick}
                          className="h-8 text-[11px] shrink-0 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          Gửi Mã Đơn
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Active Ticket Status Bar */}
                  {activeTicket && (
                    <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 px-3 py-2 flex items-center justify-between text-[11px] shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">
                          {activeTicket.ticketCode}
                        </span>
                        <Badge
                          className={`text-[9px] py-0 px-1.5 ${
                            activeTicket.status === 'OPEN'
                              ? 'bg-amber-500/20 text-amber-300'
                              : activeTicket.status === 'IN_PROGRESS'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {activeTicket.status === 'OPEN'
                            ? 'Đang chờ Admin'
                            : activeTicket.status === 'IN_PROGRESS'
                            ? 'Admin đang xử lý'
                            : 'Đã giải quyết'}
                        </Badge>
                      </div>
                      <button
                        onClick={handleCreateNewTicket}
                        className="text-slate-400 hover:text-white underline text-[10px]"
                      >
                        Tạo ticket mới
                      </button>
                    </div>
                  )}

                  {/* Message Log */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {/* Default Welcome Message */}
                    <div className="flex flex-col items-start">
                      <div className="text-[10px] text-slate-500 mb-0.5 flex items-center gap-1">
                        <Headphones className="h-3 w-3 text-cyan-400" />
                        <span>Hệ thống TUDONGNROTT</span>
                      </div>
                      <div className="max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none">
                        {greeting}! Chúng tôi là bộ phận Hỗ trợ Kỹ thuật TUDONGNROTT. Bạn đang cần hỗ trợ vấn đề gì hôm nay?
                      </div>
                    </div>

                    {/* Messages from Ticket */}
                    {activeTicket?.messages?.map((msg, idx) => {
                      const isAdminMsg = msg.sender === 'ADMIN';
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col ${isAdminMsg ? 'items-start' : 'items-end'}`}
                        >
                          <div className="text-[10px] text-slate-500 mb-0.5 flex items-center gap-1">
                            {isAdminMsg ? (
                              <>
                                <Headphones className="h-3 w-3 text-cyan-400" />
                                <span className="text-cyan-400 font-bold">
                                  {msg.senderName || 'Kỹ Thuật Viên Admin'}
                                </span>
                              </>
                            ) : (
                              <span>{msg.senderName || 'Bạn'}</span>
                            )}
                            <span>• {msg.createdAt ? formatDate(msg.createdAt) : 'Vừa xong'}</span>
                          </div>
                          <div
                            className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                              isAdminMsg
                                ? 'bg-[#0E1B2E] text-slate-100 border border-cyan-500/40 rounded-tl-none shadow-md shadow-cyan-950/40'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none shadow-md shadow-cyan-500/20'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })}

                    {isSending && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                        <span className="animate-pulse">Đang gửi tin nhắn...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                    <Input
                      placeholder={
                        activeTicket
                          ? 'Nhập tin nhắn phản hồi cho kỹ thuật viên...'
                          : 'Nhập nội dung cần hỗ trợ...'
                      }
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="h-10 text-xs bg-slate-900 border-slate-700"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="h-10 px-3.5 btn-gaming-primary shrink-0"
                      disabled={!inputText.trim() || isSending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}

              {activeTab === 'CHANNELS' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Kết nối trực tiếp với đội ngũ chăm sóc khách hàng qua các kênh xã hội chính thức:
                  </p>

                  {/* Zalo OA */}
                  <a
                    href="https://zalo.me/0983542830"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-blue-500/50 hover:bg-blue-950/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold text-sm">
                        Zalo
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs group-hover:text-blue-400 transition-colors">
                          Zalo Hỗ Trợ 24/7
                        </div>
                        <div className="text-[11px] text-slate-400">0983.542.830 (Trực tiếp)</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </a>

                  {/* Facebook Group */}
                  <a
                    href="https://www.facebook.com/share/1BFtijXXpU/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-bold text-sm">
                        FB
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs group-hover:text-indigo-400 transition-colors">
                          Facebook Fanpage & Group
                        </div>
                        <div className="text-[11px] text-slate-400">Cộng đồng người dùng NRO</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </a>
                </div>
              )}

              {activeTab === 'FAQ' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Các câu hỏi thường gặp khi mua và kích hoạt tool:
                  </p>

                  <div className="space-y-2">
                    {FAQS.map((faq, idx) => (
                      <details
                        key={idx}
                        className="group rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs"
                      >
                        <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                          <span>{faq.q}</span>
                          <span className="text-cyan-400 group-open:rotate-180 transition-transform">
                            ▼
                          </span>
                        </summary>
                        <p className="mt-2 text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
