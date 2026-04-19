// List of event data for the Events page.

export const upcomingEvent = {
  id: "ue-1",
  title: "Event Title",
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  date: "Nov 12, 2025",
  location: "Location",
  type: "upcoming",
  committee: "ai",
  image: "/images/group pic 1.jpg"
};

const groupImages = ["/images/group pic 1.jpg", "/images/group pic 2.jpg", "/images/group pic 3.jpg"];
const pastCommittees = ['cybersecurity', 'embedded', 'web', 'multimedia'];

export const pastEvents = Array(4).fill(null).map((_, index) => ({
  id: `pe-${index}`,
  title: "Event Title",
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  date: "Nov 12, 2025",
  location: "Location",
  type: "past",
  committee: pastCommittees[index % pastCommittees.length],
  image: groupImages[index % groupImages.length]
}));
