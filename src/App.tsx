import { useState, useEffect, useMemo } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

type Type = 'income' | 'expense'
type Category = 'Food' | 'Transport' | 'Housing' | 'Entertainment' | 'Health' | 'Shopping' | 'Salary' | 'Freelance' | 'Other'
type Entry = { id: string; title: string; amount: number; type: Type; category: Category; date: string }

const CATEGORY_COLORS: Record<string, string> = {
  Food:'#f97316', Transport:'#3b82f6', Housing:'#8b5cf6', Entertainment:'#ec4899',
  Health:'#10b981', Shopping:'#f59e0b', Salary:'#22d3ee', Freelance:'#6366f1', Other:'#94a3b8'
}
const INCOME_CATS: Category[] = ['Salary', 'Freelance', 'Other']
const EXPENSE_CATS: Category[] = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Other']

const SAMPLE: Entry[] = [
  { id:'1', title:'Monthly Salary', amount:5000, type:'income', category:'Salary', date:'2024-01-01' },
  { id:'2', title:'Rent', amount:1500, type:'expense', category:'Housing', date:'2024-01-02' },
  { id:'3', title:'Groceries', amount:320, type:'expense', category:'Food', date:'2024-01-05' },
  { id:'4', title:'Freelance project', amount:800, type:'income', category:'Freelance', date:'2024-01-10' },
  { id:'5', title:'Netflix & Spotify', amount:25, type:'expense', category:'Entertainment', date:'2024-01-12' },
  { id:'6', title:'Gym membership', amount:50, type:'expense', category:'Health', date:'2024-01-15' },
]

function genId() { return Math.random().toString(36).slice(2) }

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(() => {
    try { const s = localStorage.getItem('expenses'); return s ? JSON.parse(s) : SAMPLE } catch { return SAMPLE }
  })
  const [form, setForm] = useState({ title:'', amount:'', type:'expense' as Type, category:'Food' as Category, date: new Date().toISOString().slice(0,10) })
  const [filter, setFilter] = useState<'all'|'income'|'expense'>('all')

  useEffect(() => { localStorage.setItem('expenses', JSON.stringify(entries)) }, [entries])

  const totalIncome = entries.filter(e=>e.type==='income').reduce((s,e)=>s+e.amount,0)
  const totalExpense = entries.filter(e=>e.type==='expense').reduce((s,e)=>s+e.amount,0)
  const balance = totalIncome - totalExpense

  const pieData = useMemo(() => {
    const map: Record<string, number> = {}
    entries.filter(e=>e.type==='expense').forEach(e => { map[e.category] = (map[e.category]||0) + e.amount })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [entries])

  const barData = useMemo(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const map: Record<string, {income:number;expense:number}> = {}
    entries.forEach(e => {
      const m = months[new Date(e.date).getMonth()]
      if (!map[m]) map[m] = {income:0,expense:0}
      map[m][e.type] += e.amount
    })
    return Object.entries(map).map(([month,v]) => ({month,...v}))
  }, [entries])

  function addEntry() {
    if (!form.title.trim() || !form.amount) return
    setEntries(prev => [{id:genId(),...form,amount:Number(form.amount)}, ...prev])
    setForm(f => ({...f, title:'', amount:''}))
  }

  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS
  const shown = entries.filter(e => filter === 'all' ? true : e.type === filter)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Expense Tracker</h1>
        <p className="text-slate-400 mb-8">Track your income and expenses</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {label:'Balance', value:balance, icon:<DollarSign size={20}/>, color: balance>=0?'text-emerald-400':'text-rose-400'},
            {label:'Total Income', value:totalIncome, icon:<TrendingUp size={20}/>, color:'text-emerald-400'},
            {label:'Total Expenses', value:totalExpense, icon:<TrendingDown size={20}/>, color:'text-rose-400'},
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">{s.label}</span>
                <span className={s.color}>{s.icon}</span>
              </div>
              <span className={`text-2xl font-bold ${s.color}`}>${Math.abs(s.value).toLocaleString('en-US',{minimumFractionDigits:2})}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 col-span-2">
            <h2 className="font-semibold mb-4">Monthly Overview</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12}/>
                <YAxis stroke="#64748b" fontSize={12}/>
                <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:8}} labelStyle={{color:'#f1f5f9'}}/>
                <Bar dataKey="income" fill="#10b981" radius={[4,4,0,0]}/>
                <Bar dataKey="expense" fill="#f43f5e" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="font-semibold mb-4">Expenses by Category</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {pieData.map(entry => <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]||'#94a3b8'}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:8}} formatter={(v:number)=>`$${v}`}/>
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-slate-500 text-sm text-center mt-12">No expense data</p>}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-4">Add Transaction</h2>
          <div className="grid grid-cols-6 gap-3">
            <input className="col-span-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
            <input type="number" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Amount" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none" value={form.type} onChange={e=>{setForm(f=>({...f,type:e.target.value as Type,category:(e.target.value==='income'?'Salary':'Food') as Category}))}}>
              <option value="expense">Expense</option><option value="income">Income</option>
            </select>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value as Category}))}>
              {cats.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={addEntry} className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              <Plus size={16}/> Add
            </button>
          </div>
          <input type="date" className="mt-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Transactions</h2>
            <div className="flex gap-2">
              {(['all','income','expense'] as const).map(f=>(
                <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${filter===f?'bg-blue-600 text-white':'bg-slate-800 text-slate-400 hover:text-white'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {shown.map(entry=>(
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{background:CATEGORY_COLORS[entry.category]}}/>
                  <div>
                    <p className="font-medium text-sm">{entry.title}</p>
                    <p className="text-xs text-slate-400">{entry.category} · {new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${entry.type==='income'?'text-emerald-400':'text-rose-400'}`}>
                    {entry.type==='income'?'+':'-'}${entry.amount.toLocaleString()}
                  </span>
                  <button onClick={()=>setEntries(e=>e.filter(x=>x.id!==entry.id))} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all">
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
