'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Folder, Calendar, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAuthContext } from '@/components/providers/auth-provider';
import { db } from '@/lib/firebase/config';

const projectSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  description: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectOnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string>('');

  useEffect(() => {
    const orgIdParam = searchParams.get('org');
    if (orgIdParam) {
      setOrgId(orgIdParam);
      // Récupérer le nom de l'organisation
      getDoc(doc(db, 'organizations', orgIdParam)).then((docSnap) => {
        if (docSnap.exists()) {
          setOrgName(docSnap.data().name);
        }
      });
    } else {
      toast.error('Organisation non trouvée');
      router.push('/dashboard');
    }
  }, [searchParams, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as any,
  });

  const onSubmit = async (data: ProjectFormData) => {
    if (!user || !orgId) return;

    setLoading(true);
    try {
      // Créer le projet dans Firestore
      const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Préparer les données en évitant les valeurs undefined
      const projectData: any = {
        id: projectId,
        organizationId: orgId,
        name: data.name,
        startDate: new Date(data.startDate),
        budget: data.budget || 0,
        status: 'active',
        visibility: {
          isPublic: false,
          allowedUsers: [user.id],
        },
        createdBy: user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Ajouter les champs optionnels seulement s'ils existent
      if (data.endDate) projectData.endDate = new Date(data.endDate);
      if (data.description) projectData.description = data.description;
      
      await setDoc(doc(db, 'projects', projectId), projectData);

      toast.success('Premier projet créé avec succès ! 🎉');
      
      // Rediriger vers le dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Erreur lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  const skipProject = () => {
    toast.success('Vous pourrez créer un projet plus tard !');
    router.push('/dashboard');
  };

  if (!orgId) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
            <Folder className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Créez votre premier projet 🚀
          </h1>
          <p className="text-text-secondary text-lg">
            Pour <span className="font-semibold text-foreground">{orgName}</span>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 space-x-2">
          <div className="flex items-center opacity-75">
            <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center text-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium">Organisation</span>
          </div>
          <div className="w-12 h-0.5 bg-border mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="ml-2 text-sm font-medium">Premier projet</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="animate-fade-in">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Informations du projet</CardTitle>
              <CardDescription>
                Un projet peut être un événement, une saison, ou toute période que vous souhaitez suivre
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Nom du projet */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nom du projet *
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Festival 2025"
                  {...register('name')}
                  autoFocus
                />
                {errors.name && (
                  <p className="text-sm text-error">{String(errors.name.message)}</p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Date de début *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register('startDate')}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-error">{String(errors.startDate.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    Date de fin (optionnel)
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register('endDate')}
                  />
                </div>
              </div>

              {/* Budget prévisionnel */}
              <div className="space-y-2">
                <Label htmlFor="budget">
                  Budget prévisionnel (optionnel)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="50000"
                  {...register('budget', { valueAsNumber: true })}
                />
                <p className="text-xs text-text-secondary">
                  Vous pourrez ajuster ce montant plus tard
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description (optionnel)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Objectifs et informations sur le projet..."
                  rows={3}
                  {...register('description')}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={skipProject}
                disabled={loading}
              >
                Passer cette étape
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  'Création...'
                ) : (
                  <>
                    Terminer
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 bg-success/5 border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-foreground mb-1">
                  ✨ C'est presque fini !
                </p>
                <p>
                  Une fois votre projet créé, vous pourrez commencer à ajouter des transactions,
                  gérer votre budget et inviter des membres de votre équipe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

