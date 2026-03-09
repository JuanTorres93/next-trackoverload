import Section from '../Section';
import SectionHeading from '../SectionHeading';
import {
  FaChartLine,
  FaUtensils,
  FaWeight,
  FaClipboardList,
} from 'react-icons/fa';

interface RoadmapItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'current' | 'upcoming' | 'future';
}

function RoadmapItem({ icon, title, description, status }: RoadmapItemProps) {
  const statusStyles = {
    current: 'border-primary bg-primary/5',
    upcoming: 'border-amber-500 bg-amber-50',
    future: 'border-gray-200 bg-gray-50',
  };

  const statusText = {
    current: 'Disponible ahora',
    upcoming: 'Próximamente',
    future: 'Futuro',
  };

  return (
    <div
      className={`relative p-6 rounded-2xl border-2 ${statusStyles[status]} transition-all hover:shadow-md`}
    >
      {/* Estado */}
      <span
        className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full ${
          status === 'current'
            ? 'bg-primary text-white'
            : status === 'upcoming'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-200 text-gray-600'
        }`}
      >
        {statusText[status]}
      </span>

      {/* Icono */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${
          status === 'current'
            ? 'bg-primary text-white'
            : status === 'upcoming'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-200 text-gray-500'
        }`}
      >
        {icon}
      </div>

      <h3 className="mb-2 text-xl font-bold text-text">{title}</h3>
      <p className="text-text-minor-emphasis">{description}</p>
    </div>
  );
}

export default function Roadmap() {
  return (
    <Section className="bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeading subtitle="Cimientos está creciendo. Esto es lo que ya existe y lo que viene.">
          Hoja de ruta
        </SectionHeading>

        {/* Grid de features */}
        <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Nutrición - Disponible */}
          <RoadmapItem
            icon={<FaUtensils />}
            title="Nutrición"
            description="Registro de calorías y proteínas, escaneo de códigos de barras, recetario personal y planificador semanal."
            status="current"
          />

          {/* Seguimiento de peso - Próximamente */}
          <RoadmapItem
            icon={<FaWeight />}
            title="Seguimiento de peso"
            description="Registro y seguimiento de tu peso a lo largo del tiempo."
            status="upcoming"
          />

          {/* Entrenamientos - Próximamente */}
          <RoadmapItem
            icon={<FaClipboardList />}
            title="Entrenamientos"
            description="Rutinas, seguimiento de series y repeticiones, y el método 'una repetición más' integrado."
            status="upcoming"
          />

          {/* Progreso - Próximamente */}
          <RoadmapItem
            icon={<FaChartLine />}
            title="Seguimiento de progreso"
            description="Gráficas de evolución, fotos de progreso, y métricas de fuerza."
            status="upcoming"
          />
        </div>

        {/* Nota a pie */}
        <p className="mt-12 text-sm text-center text-text-minor-emphasis">
          ¿Echas de menos alguna funcionalidad?{' '}
          <a
            href="mailto:juan@juantorres.me"
            className="font-medium text-primary hover:underline"
          >
            Escríbeme al mail de la newsletter
          </a>
        </p>
      </div>
    </Section>
  );
}
