import { BuilderProfileCard } from "./builder-profile-card";
import { fetchBuilderById } from "./builderactions";


interface BuildDetailPageProps {
  params: { builder: string }
  searchParams?: { tab?: string; comment?: string } // Make searchParams optional
}

export default async function BuilderDetailPage({ params }: BuildDetailPageProps) {
  // Fetch builder data
  const builder = await fetchBuilderById(params.builder)
  const builderfirst = builder?.shift()

  // Get the current user - remove this if not needed
  // const supabase = await createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto p-6">
      {builderfirst ? (
        <BuilderProfileCard
          builder={{
            id: builderfirst.id,
            name: builderfirst.name,
            description: builderfirst.description,
            avatar_url: builderfirst.avatar_url,
            created_at: builderfirst.created_at,
            updated_at: builderfirst.updated_at,
            // You can add more fields here as they become available
            projects_count: 0, // Placeholder
          }}
        />
      ) : (
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold">Builder not found</h2>
          <p className="text-muted-foreground mt-2">
            The builder you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      )}
    </div>
  )
}

