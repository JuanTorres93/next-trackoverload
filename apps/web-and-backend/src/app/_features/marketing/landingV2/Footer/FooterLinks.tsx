import { twMerge } from "tailwind-merge";

import LinksColumn from "./LinksColumn";

function FooterLinks({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("flex gap-32", className)} {...rest}>
      {footerLinks.map((column, index) => (
        <LinksColumn
          key={index}
          columnTitle={column.columnTitle}
          links={column.links}
        />
      ))}
    </div>
  );
}

const footerLinks = [
  {
    columnTitle: "Home",
    links: [
      { name: "About Us", href: "/#about" },
      { name: "How It Works", href: "/#how-it-works" },
      { name: "Features", href: "/#features" },
      { name: "Testimonials", href: "/#testimonials" },
      { name: "Pricing", href: "/#pricing" },
    ],
  },
  //{
  //  columnTitle: "Features",
  //  links: [
  //    { name: "Feature 1", href: "#" },
  //    { name: "Feature 2", href: "#" },
  //    { name: "Feature 3", href: "#" },
  //    { name: "ETC...", href: "#" },
  //  ],
  //},
  {
    columnTitle: "Pricing",
    links: [
      { name: "Basic plan", href: "/#pricing" },
      { name: "Premium plan", href: "/#pricing" },
    ],
  },
];

export default FooterLinks;
