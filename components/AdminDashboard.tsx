
import React, { useMemo, useState } from 'react';
import { OrderDetails, User, AdminAnalytics, OrderStatus } from '../types';

interface AdminDashboardProps {
  orders: OrderDetails[];
  customers: User[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, customers, onUpdateStatus, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');

  const analytics: AdminAnalytics = useMemo(() => {
    const today = new Date().toLocaleDateString();
    const total_revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const orders_today = orders.filter(o => new Date(o.date).toLocaleDateString() === today).length;
    
    const customerOrderCounts: Record<string, { count: number; name: string }> = {};
    orders.forEach(o => {
      if (!customerOrderCounts[o.customer_id]) {
        customerOrderCounts[o.customer_id] = { count: 0, name: o.customerName };
      }
      customerOrderCounts[o.customer_id].count += 1;
    });

    let topCustomerStr = "N/A";
    let maxOrders = 0;
    Object.values(customerOrderCounts).forEach(c => {
      if (c.count > maxOrders) {
        maxOrders = c.count;
        topCustomerStr = `${c.name} (${c.count} orders)`;
      }
    });

    return {
      total_orders: orders.length,
      total_revenue,
      orders_today,
      top_customer: topCustomerStr
    };
  }, [orders]);

  const customerAnalysis = useMemo(() => {
    return customers.filter(c => c.role === 'CUSTOMER').map(customer => {
      const customerOrders = orders.filter(o => o.customer_id === customer.id);
      const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
      const lastOrderDate = customerOrders.length > 0 
        ? customerOrders[customerOrders.length - 1].date 
        : 'Never';
      
      return {
        ...customer,
        orderCount: customerOrders.length,
        totalSpent,
        lastOrderDate
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [customers, orders]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-[#130f40] text-white px-8 py-5 flex items-center justify-between sticky top-0 z-[150] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ff7800] rounded-2xl flex items-center justify-center shadow-lg rotate-3">
             <span className="text-white font-black text-xl">GM</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Admin Panel</h1>
            <p className="text-[10px] font-black text-[#ff7800] uppercase tracking-widest">Master Control Hub</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex bg-white/10 rounded-2xl p-1">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-[#ff7800] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              Orders Feed
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'customers' ? 'bg-[#ff7800] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              Customers Analysis
            </button>
          </div>
          <button 
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-grow p-8 container mx-auto">
        {/* Real-time Pulse Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black text-[#130f40] tracking-tighter">
              OPERATIONAL <span className="text-[#ff7800]">PULSE</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mt-1">Real-time Data Processing Active</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
            <span className="text-xs font-black text-[#130f40] uppercase tracking-widest">System Online</span>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[3rem] -z-0 opacity-40 group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Total Volume</span>
            <div className="text-5xl font-black text-[#130f40] mb-2">{analytics.total_orders}</div>
            <span className="text-xs font-bold text-[#ff7800] uppercase tracking-widest">Orders Handled</span>
          </div>
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-[3rem] -z-0 opacity-40 group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Gross Revenue</span>
            <div className="text-5xl font-black text-[#130f40] mb-2">${analytics.total_revenue.toFixed(2)}</div>
            <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Total Earnings</span>
          </div>
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[3rem] -z-0 opacity-40 group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Daily Peak</span>
            <div className="text-5xl font-black text-[#130f40] mb-2">{analytics.orders_today}</div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Orders Today</span>
          </div>
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[3rem] -z-0 opacity-40 group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Top Performer</span>
            <div className="text-xl font-black text-[#130f40] mt-4 truncate">{analytics.top_customer}</div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest block mt-1">MVP Customer</span>
          </div>
        </div>

        {activeTab === 'orders' ? (
          <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-50 overflow-hidden animate-fade-in">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-2xl font-black text-[#130f40] tracking-tight uppercase">Real-Time Order Feed</h3>
              <div className="flex gap-4">
                 <div className="px-4 py-2 bg-[#ff7800]/10 text-[#ff7800] rounded-xl text-[10px] font-black uppercase tracking-widest">
                   {orders.filter(o => o.status === 'pending').length} Pending
                 </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white">
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer / Phone</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Shipping Address</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Inventory Items</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-24 text-center text-gray-300 font-bold text-lg italic">Waiting for new orders...</td>
                    </tr>
                  ) : (
                    orders.slice().reverse().map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-all group">
                        <td className="px-10 py-8">
                          <div className="font-black text-lg text-[#130f40] group-hover:text-[#ff7800] transition-colors">{order.customerName}</div>
                          <div className="text-xs text-[#ff7800] font-black tracking-widest mt-1">
                            {order.whatsapp || order.customerPhone || 'NO PHONE RECORDED'}
                          </div>
                          <div className="text-[9px] text-gray-300 font-black mt-2 uppercase tracking-widest">{order.date}</div>
                        </td>
                        <td className="px-10 py-8 max-w-[200px]">
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-tighter">
                              {order.address || 'Pickup Required'}
                            </p>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-1 border border-gray-100">
                                <span className="text-[9px] font-black text-[#ff7800]">X{item.quantity}</span>
                                <span className="text-[11px] font-black text-[#130f40] truncate uppercase">
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-10 py-8 font-black text-xl text-[#130f40]">${order.total.toFixed(2)}</td>
                        <td className="px-10 py-8">
                          <div className="relative inline-block w-full max-w-[160px]">
                            <select 
                              value={order.status}
                              onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                              className={`w-full text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl outline-none border-2 transition-all cursor-pointer appearance-none ${
                                order.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                order.status === 'shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                'bg-gray-50 text-gray-600 border-gray-100'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-50 overflow-hidden animate-fade-in">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-2xl font-black text-[#130f40] tracking-tight uppercase">Customer Intelligence Directory</h3>
              <div className="bg-[#130f40] text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                {customerAnalysis.length} Total Users
              </div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {customerAnalysis.map(stat => (
                <div key={stat.id} className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 group hover:bg-white hover:border-[#ff7800] hover:shadow-xl transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-gray-100 flex items-center justify-center text-2xl font-black text-[#ff7800] shadow-sm group-hover:bg-[#ff7800] group-hover:text-white transition-all">
                      {stat.name.charAt(0)}
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Lifetime Spent</span>
                       <span className="text-3xl font-black text-[#130f40]">${stat.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-black text-[#130f40] mb-1 group-hover:text-[#ff7800] transition-colors">{stat.name}</h4>
                  <p className="text-xs text-gray-400 font-bold mb-6 truncate">{stat.email}</p>
                  
                  <div className="mt-auto space-y-4 pt-6 border-t border-gray-100/50">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</span>
                      <span className="text-xs font-black text-[#ff7800]">{stat.phone || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Address</span>
                      <span className="text-[11px] font-bold text-gray-600 bg-white p-3 rounded-xl border border-gray-100 line-clamp-2">
                        {stat.address || 'No address provided during registration.'}
                      </span>
                    </div>
                    <div className="pt-4 flex justify-between items-center border-t border-gray-100/50">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orders</span>
                      <span className="px-3 py-1 bg-[#130f40] text-white rounded-lg text-xs font-black">{stat.orderCount}</span>
                    </div>
                  </div>
                </div>
              ))}
              {customerAnalysis.length === 0 && (
                <div className="col-span-full py-24 text-center text-gray-300 font-bold italic">No customer data available yet.</div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="p-8 text-center bg-gray-50 border-t border-gray-100">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Grandmart Supermarket • Secure Admin Protocol v4.0.2</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
