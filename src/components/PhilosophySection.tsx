import React from 'react';
import { HelpCircle } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Philosophy Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-semibold mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>[ПРИНЦИПЫ СООБЩЕСТВА]</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight leading-snug mb-6">
              «Почему ты выкладываешь такую ценную информацию и плагины совершенно бесплатно?»
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              <p>
                Мне регулярно пишут это в комментариях на Rutube, в личку ВКонтакте и в TenChat. В профессии инженера-проектировщика я вижу одну и ту же боль: <strong>сотни часов тратятся на рутину</strong> — пересчет арматуры вручную, подгонку таблиц в Excel, исправление съехавших масштабов.
              </p>
              <p>
                Я считаю, что базовые инструменты автоматизации и качественные уроки должны быть <strong>открыты для каждого</strong> — от студента строительного вуза до инженера в проектном институте. Чем быстрее мы автоматизируем рутину, тем качественнее и надежнее строятся здания вокруг нас.
              </p>
              <p>
                Все, что выходит на моих каналах (Rutube, VK, Дзен, MAX) — всегда останется <strong>100% бесплатным</strong>. А материалы на Boosty созданы для тех, кто хочет поддержать проект и получить закрытые исходники, BIM-модели реальных объектов и индивидуальные разборы.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Все плагины в открытом доступе</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Честные уроки без скрытых продаж</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Поддержка отечественного сообщества инженеров</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

