import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <>
      <PageHeader showTitle title="Page not found" intro="The page you were looking for has moved or no longer exists." />
      <section className="bg-off-white py-16 sm:py-20">
        <Container>
          <ButtonLink href="/" variant="outline-dark">
            Back to the homepage
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
