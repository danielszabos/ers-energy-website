import { versionedPublicFile } from "@/lib/assets";
import type { GalleryProject } from "@/lib/gallery";
import { GalleryStrip } from "./GalleryStrip";
import type { ProjectPhoto } from "./ProjectPhotos";

/**
 * Finds the project's photos in /public (file checks run on the server) and
 * hands them to its strip. Photos that aren't there are left out rather than
 * shown broken.
 */
export function GalleryProjectSection({ project }: { project: GalleryProject }) {
  const { hero, photos, folder, ...rest } = project;
  const find = (file: string) => versionedPublicFile(`/projects/ERS Projects/${folder}/${file}`);

  const heroSrc = find(hero.file);
  const found = photos.flatMap<ProjectPhoto>(({ file, ...photo }) => {
    const src = find(file);
    return src ? [{ ...photo, src }] : [];
  });

  return (
    <GalleryStrip
      project={{
        ...rest,
        hero: heroSrc ? { src: heroSrc, position: hero.position } : null,
        photos: found,
      }}
    />
  );
}
