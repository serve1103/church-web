import Image from "next/image";
import { PortableText } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import type { NewFamilySettings } from "@/types/sanity";

interface NewFamilyIntroProps {
  settings: NewFamilySettings | null;
}

const NewFamilyIntro = ({ settings }: NewFamilyIntroProps) => {
  if (!settings) return null;

  const { welcomeMessage, registrationSteps, assignedStaff } = settings;
  const hasContent =
    welcomeMessage?.length || registrationSteps?.length || assignedStaff?.length;

  if (!hasContent) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
      {/* 환영 인사말 */}
      {welcomeMessage && welcomeMessage.length > 0 && (
        <section className="mb-10">
          <div className="mx-auto max-w-3xl">
            <div className="prose-custom [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-text-secondary [&_strong]:font-bold [&_strong]:text-text [&_em]:italic [&_a]:text-primary-light [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_li]:text-text-secondary [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-text [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-text [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-secondary">
              <PortableText value={welcomeMessage} />
            </div>
          </div>
        </section>
      )}

      {/* 등록 절차 */}
      {registrationSteps && registrationSteps.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-6 text-xl font-bold text-text">등록 절차</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {registrationSteps.map((step) => (
              <div
                key={step._key}
                className="flex gap-4 rounded-xl border border-border bg-white p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {step.stepNumber}
                </span>
                <div>
                  <h3 className="font-semibold text-text">{step.title}</h3>
                  {step.description && (
                    <p className="mt-1 text-sm text-text-secondary">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 담당 교역자 */}
      {assignedStaff && assignedStaff.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-6 text-xl font-bold text-text">담당 교역자</h2>
          <div className="flex flex-wrap gap-8">
            {assignedStaff.map((staff) => (
              <div
                key={staff._id}
                className="flex flex-col items-center text-center"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gradient-to-b from-primary/5 to-primary/10">
                  {staff.photo ? (
                    <Image
                      src={urlFor(staff.photo).width(160).height(160).url()}
                      alt={staff.name}
                      fill
                      className="object-cover object-top"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-2xl font-light text-primary/30">
                        {staff.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-2 font-semibold text-text">{staff.name}</p>
                <p className="text-sm text-accent">{staff.position}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NewFamilyIntro;
