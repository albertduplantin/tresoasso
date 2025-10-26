'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Building2, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthContext } from '@/components/providers/auth-provider';
import { db } from '@/lib/firebase/config';

const organizationSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  type: z.enum(['festival', 'theater', 'music', 'sport', 'charity', 'education', 'other']),
  siret: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

const ORGANIZATION_TYPES = [
  { value: 'festival', label: '🎭 Festival / Événement culturel', icon: Calendar },
  { value: 'theater', label: '🎬 Compagnie de théâtre', icon: Building2 },
  { value: 'music', label: '🎵 Association musicale', icon: Users },
  { value: 'sport', label: '⚽ Club sportif', icon: Users },
  { value: 'charity', label: '❤️ Œuvre caritative', icon: Building2 },
  { value: 'education', label: '📚 Association éducative', icon: Building2 },
  { value: 'other', label: '✨ Autre', icon: Sparkles },
];

export default function OrganizationOnboardingPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema) as any,
    defaultValues: {
      type: 'festival',
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: OrganizationFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      // Créer l'organisation dans Firestore
      const orgId = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Préparer les données conformes au type Organization
      const orgData: any = {
        id: orgId,
        name: data.name,
        legalForm: 'association', // Type légal
        address: data.address || '',
        email: user.email || '',
        phone: '',
        vatEnabled: false,
        ownerId: user.id, // Champ ajouté dans le type Organization
        memberIds: [user.id], // Liste des membres
        subscriptionTier: 'free',
        settings: {
          fiscalYearStart: '01-01',
          accountingPlan: 'associatif',
          currency: 'EUR',
          notifications: {
            emailEnabled: true,
            budgetAlertThreshold: 80,
            reminderDaysBeforeDue: 7,
            notifyAllCAOnNewEntry: false,
            notifyTreasurerOnly: true,
          },
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Ajouter les champs optionnels seulement s'ils existent
      if (data.siret) {
        orgData.siret = data.siret;
      }
      
      await setDoc(doc(db, 'organizations', orgId), orgData);

      // Mettre à jour l'utilisateur avec l'organisation
      await setDoc(
        doc(db, 'users', user.id),
        {
          organizations: [
            {
              organizationId: orgId,
              role: 'admin',
              permissions: ['read', 'write', 'delete', 'manage'],
              joinedAt: new Date(), // serverTimestamp() ne fonctionne pas dans les arrays
            },
          ],
        },
        { merge: true }
      );

      toast.success('Organisation créée avec succès !');
      
      // Rediriger vers la création du premier projet
      router.push(`/onboarding/project?org=${orgId}`);
    } catch (error) {
      console.error('Error creating organization:', error);
      toast.error('Erreur lors de la création de l\'organisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue sur TrésoAsso ! 👋
          </h1>
          <p className="text-text-secondary text-lg">
            Commençons par créer votre organisation
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 space-x-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <span className="ml-2 text-sm font-medium">Organisation</span>
          </div>
          <div className="w-12 h-0.5 bg-border mx-2"></div>
          <div className="flex items-center opacity-50">
            <div className="w-8 h-8 rounded-full bg-surface border-2 border-border flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="ml-2 text-sm">Premier projet</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="animate-fade-in">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Informations de l'organisation</CardTitle>
              <CardDescription>
                Ces informations nous aideront à personnaliser votre expérience
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Nom de l'organisation */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nom de l'association *
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Festival du Court Métrage de Dinan"
                  {...register('name')}
                  autoFocus
                />
                {errors.name && (
                  <p className="text-sm text-error">{String(errors.name.message)}</p>
                )}
              </div>

              {/* Type d'organisation */}
              <div className="space-y-2">
                <Label htmlFor="type">Type d'organisation *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ORGANIZATION_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setValue('type', type.value as any)}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all
                        ${
                          selectedType === type.value
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-border hover:border-primary/50 hover:bg-surface'
                        }
                      `}
                    >
                      <div className="font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
                {errors.type && (
                  <p className="text-sm text-error">{String(errors.type.message)}</p>
                )}
              </div>

              {/* SIRET (optionnel) */}
              <div className="space-y-2">
                <Label htmlFor="siret">
                  Numéro SIRET (optionnel)
                </Label>
                <Input
                  id="siret"
                  placeholder="123 456 789 00012"
                  {...register('siret')}
                />
                <p className="text-xs text-text-secondary">
                  Utile pour les exports comptables
                </p>
              </div>

              {/* Adresse (optionnelle) */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  Adresse (optionnel)
                </Label>
                <Input
                  id="address"
                  placeholder="123 rue de la République, 22100 Dinan"
                  {...register('address')}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description (optionnel)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Quelques mots sur votre association..."
                  rows={3}
                  {...register('description')}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/login')}
                disabled={loading}
              >
                Retour
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  'Création...'
                ) : (
                  <>
                    Continuer
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 bg-info/5 border-info/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-foreground mb-1">
                  💡 Astuce
                </p>
                <p>
                  Vous pourrez modifier ces informations à tout moment dans les paramètres.
                  Vous pourrez également gérer plusieurs organisations depuis le même compte !
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

