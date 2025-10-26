import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, FileText, Users, Shield, TrendingUp, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TrésoAsso</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>
                Commencer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Gérez les finances de votre association en toute simplicité
        </h1>
        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Suivi en temps réel des recettes et dépenses, distinction des montants certains et hypothétiques, 
          exports comptables automatisés.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-lg">
              Essai gratuit 30 jours <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg">
              Découvrir les fonctionnalités
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tout ce dont vous avez besoin pour gérer votre trésorerie
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              title="Dashboard en temps réel"
              description="Visualisez instantanément l'état de vos finances avec des graphiques interactifs et des KPIs clairs."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-success" />}
              title="Certains vs Hypothétiques"
              description="Distinguez facilement les montants confirmés des montants probables ou potentiels pour une vision réaliste."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-info" />}
              title="Exports comptables"
              description="Générez automatiquement vos bilans, comptes de résultat et exports Excel/CSV conformes."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-secondary" />}
              title="Collaboration CA"
              description="Donnez accès à tous les membres du CA avec des permissions granulaires et notifications personnalisées."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-warning" />}
              title="Sécurité & Audit"
              description="Données chiffrées, audit trail complet, sauvegardes automatiques. Conformité RGPD garantie."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-error" />}
              title="Workflow automatisé"
              description="Validation des transactions, relances automatiques, notifications intelligentes pour ne rien oublier."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à simplifier votre gestion financière ?
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Rejoignez les associations qui ont déjà adopté TrésoAsso. 
            Essai gratuit, sans carte bancaire, pendant 30 jours.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg">
              Commencer maintenant <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">TrésoAsso</span>
              </div>
              <p className="text-sm text-text-secondary">
                La solution de gestion financière dédiée aux associations culturelles.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link href="#features" className="hover:text-primary">Fonctionnalités</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Tarifs</Link></li>
                <li><Link href="/demo" className="hover:text-primary">Démo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link href="/help" className="hover:text-primary">Documentation</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link href="/privacy" className="hover:text-primary">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-primary">CGU</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-text-secondary">
            © 2025 TrésoAsso. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-background p-6 rounded-lg shadow-card hover:shadow-hover transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
