export const metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso del servicio',
};

import {
  LegalExternalLink,
  LegalH2,
  LegalH3,
  LegalList,
  LegalMeta,
  LegalP,
  LegalPage,
  LegalSection,
  LegalTitle,
} from '../_components/Legal';

const BRAND = 'Next Trackoverload';
const EFFECTIVE_DATE = '2 de marzo de 2026';

// Datos del titular (pendiente de completar por el titular)
const LEGAL: {
  legalName: string;
  taxId?: string | null;
  address: string;
  country: string;
  email: string;
} = {
  legalName: 'Juan Torres Navarro',
  taxId: null,
  address: 'Albacete, 02003',
  country: 'España',
  email: 'juan@juantorres.me',
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage>
      <LegalTitle>Términos y Condiciones</LegalTitle>
      <LegalMeta>
        Última actualización / entrada en vigor:{' '}
        <strong>{EFFECTIVE_DATE}</strong>
      </LegalMeta>

      <LegalSection>
        <LegalH2>1. Identificación del titular</LegalH2>
        <LegalP>
          Este servicio (en adelante, el <strong>“Servicio”</strong>) es operado
          por <strong>{LEGAL.legalName}</strong>
          {LEGAL.taxId ? ` (${LEGAL.taxId})` : ''}, con domicilio en{' '}
          <strong>{LEGAL.address}</strong>, {LEGAL.country}. Email de contacto:{' '}
          <strong>{LEGAL.email}</strong>.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>2. Aceptación de los términos</LegalH2>
        <LegalP>
          Al crear una cuenta, acceder o utilizar {BRAND}, aceptas estos
          Términos y Condiciones. Si no estás de acuerdo, no utilices el
          Servicio.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>3. Edad mínima</LegalH2>
        <LegalP>
          El Servicio está dirigido a personas mayores de 18 años. Si eres menor
          de 18, no debes crear una cuenta ni contratar una Suscripción.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>4. Descripción del Servicio</LegalH2>
        <LegalP>
          {BRAND} ofrece funcionalidades orientadas al seguimiento de nutrición
          y, potencialmente, entrenamiento (por ejemplo, registro de
          comidas/recetas, ingredientes y resúmenes nutricionales).
        </LegalP>
        <LegalP>
          El Servicio puede evolucionar y cambiar (añadir, modificar o retirar
          funcionalidades) para mejorar la experiencia, seguridad o
          mantenimiento.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>5. Cuenta de usuario</LegalH2>
        <LegalList>
          <li>
            Debes proporcionar información veraz y mantenerla actualizada.
          </li>
          <li>
            Eres responsable de la confidencialidad de tus credenciales y de
            toda actividad realizada desde tu cuenta.
          </li>
          <li>
            Nos reservamos el derecho de suspender o cancelar cuentas ante uso
            fraudulento, abuso, incumplimiento legal o violación de estos
            términos.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection>
        <LegalH2>6. Uso permitido y conductas prohibidas</LegalH2>
        <LegalP>Te comprometes a no:</LegalP>
        <LegalList>
          <li>
            Usar el Servicio con fines ilícitos o para vulnerar derechos de
            terceros.
          </li>
          <li>
            Interferir con la seguridad o el funcionamiento del Servicio (p.
            ej., introducir malware, realizar scraping abusivo, pruebas de carga
            no autorizadas).
          </li>
          <li>
            Acceder o intentar acceder a áreas, datos o sistemas sin
            autorización.
          </li>
          <li>
            Usar el Servicio de forma que degrade su disponibilidad para otros
            usuarios.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection>
        <LegalH2>7. Contenido del usuario</LegalH2>
        <LegalP>
          Puedes introducir datos como recetas, comidas, ingredientes, nombres y
          otros contenidos (en adelante,{' '}
          <strong>“Contenido del Usuario”</strong>).
        </LegalP>
        <LegalList>
          <li>Mantienes la titularidad sobre tu Contenido del Usuario.</li>
          <li>
            Nos concedes una licencia limitada, mundial y no exclusiva para
            alojar, procesar y mostrar dicho contenido únicamente con el fin de
            operar el Servicio.
          </li>
          <li>
            Garantizas que tienes los derechos necesarios sobre el contenido que
            subes (incluidas imágenes), y que no infringe derechos de terceros.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection>
        <LegalH2>8. Información nutricional y de salud (descargo)</LegalH2>
        <LegalP>
          {BRAND} no proporciona asesoramiento médico. La información mostrada
          (por ejemplo, calorías, proteínas u otros valores) es orientativa y
          puede contener errores. Consulta a profesionales sanitarios antes de
          realizar cambios significativos en dieta o actividad física.
        </LegalP>
        <LegalP>
          En caso de enfermedad, alergias, embarazo, lesiones u otras
          condiciones, usa el Servicio con precaución y bajo supervisión
          profesional.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>9. Planes de pago, suscripciones y facturación</LegalH2>
        <LegalP>
          Algunas funcionalidades pueden requerir pago o suscripción (en
          adelante,
          <strong> “Suscripción”</strong>). Los detalles de precio, periodicidad
          y características se mostrarán antes de la compra.
        </LegalP>

        <LegalH3>9.1 Precio y periodicidad</LegalH3>
        <LegalP>
          Salvo que en el momento de compra se indique otra cosa, la Suscripción
          tiene un precio de <strong>2€ al mes (IVA incluido)</strong> y se
          renueva de forma mensual.
        </LegalP>

        <LegalH3>9.2 Procesamiento de pagos con Stripe</LegalH3>
        <LegalP>
          Los pagos se procesan mediante <strong>Stripe</strong> (tercero). Al
          comprar, aceptas que Stripe trate tus datos de pago conforme a sus
          condiciones y políticas. Más información:{' '}
          <LegalExternalLink
            href="https://stripe.com/legal"
            target="_blank"
            rel="noreferrer"
          >
            https://stripe.com/legal
          </LegalExternalLink>
        </LegalP>
        <LegalP>
          No almacenamos los datos de tu tarjeta. Stripe puede almacenar y
          procesar dichos datos en nuestro nombre.
        </LegalP>

        <LegalH3>9.3 Periodo de prueba (14 días)</LegalH3>
        <LegalP>
          La Suscripción puede incluir un periodo de prueba gratuito de{' '}
          <strong>14 días</strong>.
        </LegalP>
        <LegalP>
          La prueba se ofrece para que evalúes el Servicio. Al finalizar el
          periodo de prueba, <strong>no se te cobrará automáticamente</strong>
          salvo que completes de forma expresa el proceso de suscripción de pago
          (por ejemplo, introduciendo un método de pago y confirmando la
          compra).
        </LegalP>

        <LegalH3>9.4 Renovación, cancelación y cambios</LegalH3>
        <LegalList>
          <li>
            Salvo indicación en contrario, la Suscripción se renueva
            automáticamente al final de cada periodo.
          </li>
          <li>
            Puedes cancelar la renovación en cualquier momento; la cancelación
            tendrá efecto al final del periodo ya pagado, salvo que se indique
            lo contrario.
          </li>
          <li>
            Podemos cambiar precios o condiciones de planes con preaviso
            razonable cuando sea legalmente exigible. Los cambios aplicarán en
            la siguiente renovación.
          </li>
          <li>
            Si el cobro falla o se revoca (por ejemplo, por caducidad del método
            de pago), podremos suspender o limitar el acceso a funcionalidades
            de pago hasta que se regularice la situación.
          </li>
        </LegalList>

        <LegalH3>9.5 Reembolsos</LegalH3>
        <LegalP>
          Política de reembolsos: <strong>no se ofrecen reembolsos</strong>,
          salvo que la normativa aplicable exija lo contrario.
        </LegalP>
        <LegalP>
          Nada en estos Términos limita los derechos irrenunciables que pudieran
          corresponderte como consumidor según la normativa aplicable.
        </LegalP>

        <LegalH3>9.6 Derecho de desistimiento (consumidores)</LegalH3>
        <LegalP>
          Si contratas como consumidor en España o la UE, es posible que
          dispongas de un derecho de desistimiento de 14 días en determinadas
          contrataciones a distancia. No obstante, en servicios digitales, si
          solicitas que la prestación comience de forma inmediata, el
          desistimiento puede quedar excluido o dar lugar al pago de la parte
          proporcional, según proceda y conforme a la normativa aplicable.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>10. Disponibilidad, mantenimiento y cambios</LegalH2>
        <LegalP>
          Intentamos mantener el Servicio disponible, pero no garantizamos
          disponibilidad ininterrumpida. Puede haber interrupciones por
          mantenimiento, incidencias o causas fuera de nuestro control.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>11. Propiedad intelectual</LegalH2>
        <LegalP>
          El Servicio, su diseño, marca, código y materiales (excepto el
          Contenido del Usuario) son propiedad del titular o de sus licenciantes
          y están protegidos por la normativa aplicable. No se concede ningún
          derecho salvo los expresamente indicados.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>12. Limitación de responsabilidad</LegalH2>
        <LegalP>
          En la medida permitida por la ley, el Servicio se ofrece “tal cual”.
          No seremos responsables de daños indirectos, pérdida de beneficios,
          pérdida de datos o daños derivados del uso o imposibilidad de uso del
          Servicio.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>13. Protección de datos</LegalH2>
        <LegalP>
          El tratamiento de datos personales se realizará conforme a la
          normativa aplicable (incluyendo el RGPD) y a la información de
          privacidad facilitada dentro del Servicio.
        </LegalP>
        <LegalP>
          En particular, para pagos se aplican también las políticas de Stripe.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>14. Cookies</LegalH2>
        <LegalP>
          El Servicio puede usar cookies o tecnologías similares estrictamente
          necesarias para el inicio de sesión y el mantenimiento de la sesión
          del usuario. No utilizamos cookies publicitarias ni de seguimiento con
          fines de marketing.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>15. Terminación</LegalH2>
        <LegalP>
          Puedes dejar de usar el Servicio en cualquier momento. Podemos
          suspender o terminar tu acceso si incumples estos Términos o por
          razones de seguridad, legales o técnicas.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>16. Legislación aplicable y jurisdicción</LegalH2>
        <LegalP>
          Estos Términos se regirán por las leyes de <strong>España</strong>.
          Cualquier disputa se someterá a los juzgados y tribunales de{' '}
          <strong>Albacete</strong>, salvo que la normativa de consumidores
          establezca otro fuero.
        </LegalP>
      </LegalSection>

      <LegalSection>
        <LegalH2>17. Contacto</LegalH2>
        <LegalP>
          Para soporte: <strong>{LEGAL.email}</strong>.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
