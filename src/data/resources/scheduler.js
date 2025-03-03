import DocsIcon from "../../assets/docs-icon.png";
import JiraIcon from "../../assets/jira-icon.svg";
import CompetitorsIcon from "../../assets/competitors-icon.svg";
import RoadmapIcon from "../../assets/roadmap-icon.png";
import SlackIcon from "../../assets/slack-icon.png";
import PeopleIcon from "../../assets/people-icon.png";
import BugIcon from "../../assets/bug-icon.png";
import FigmaIcon from "../../assets/figma-icon.png";
import { People } from "@mui/icons-material";

export const schedulerResources = [
  {
    name: "roadmap",
    type: "roadmap",
    icon: RoadmapIcon,
    specifiers: [
      {
        identifier: "Interactive",
        metadata: {
          link: "https://scheduler-v3-roadmap.vercel.app/",
        },
      },
      {
        identifier: "ProductHub",
        metadata: {
          link: "https://nylas.atlassian.net/jira/polaris/projects/RT/ideas/view/4665863",
        },
      },
    ],
  },
  {
    name: "bugs",
    type: "bugs",
    icon: BugIcon,
    specifiers: [
      {
        identifier: "report",
        metadata: {
          link: "https://nylas.atlassian.net/browse/SS-83",
        },
      },
    ],
  },
  {
    name: "docs",
    type: "docs",
    icon: DocsIcon,
    specifiers: [
      {
        identifier: "overview",
        metadata: {
          link: "https://developer.nylas.com/docs/v3/scheduler/#how-scheduler-works",
        },
      },
      {
        identifier: "getting started",
        metadata: {
          link: "https://developer.nylas.com/docs/v3/scheduler/getting-started/",
        },
      },
      {
        identifier: "API reference",
        metadata: {
          link: "https://developer.nylas.com/docs/api/v3/scheduler/",
        },
      },
      {
        identifier: "component reference",
        metadata: {
          link: "https://nylas-scheduler-ui-components.pages.dev/docs/web-elements/scheduler",
        },
      },
    ],
  },
  {
    name: "people",
    type: "workspace",
    icon: PeopleIcon,
    specifiers: [
      {
        identifier: "product manager",
        metadata: {
          link: "https://nylas.slack.com/team/U05R4LCUUBH",
        },
      },
      {
        identifier: "engineering lead",
        metadata: {
          link: "https://nylas.slack.com/team/U01CEDZFQJZ",
        },
      },
      {
        identifier: "product marketing manager",
        metadata: {
          link: "https://nylas.slack.com/team/U02BMLSDG2X",
        },
      },
    ],
  },
  {
    name: "designs",
    type: "custom",
    icon: FigmaIcon,
    specifiers: [
      {
        identifier: "scheduling component",
        metadata: {
          link: "https://www.figma.com/design/S9lWYObWFkNlv6lkds7dYJ/Scheduling-page-v3---Jan-2024?node-id=591-34036&t=ew5sPlfmoSlCIizs-1",
        },
      },
      {
        identifier: "editor component",
        metadata: {
          link: "https://www.figma.com/design/Ru23GfsklKiFneCSU5KWgc/Schedule-editor-v3---Jan-2024?node-id=1-106&t=XuQDfSxpUjybaYv4-1",
        },
      },
    ],
  },
  {
    name: "slack",
    type: "custom",
    icon: SlackIcon,
    specifiers: [
      {
        identifier: "sq-scheduler",
        metadata: {
          link: "https://nylas.slack.com/archives/C067DBCBNGM",
        },
      },
      {
        identifier: "docs-scheduler-v3",
        metadata: {
          link: "https://nylas.slack.com/archives/C06DAVA3CR1",
        },
      },
      {
        identifier: "gtm-scheduler-v3",
        metadata: {
          link: "https://nylas.slack.com/archives/C06SKARTQPN",
        },
      },
    ],
  },
  {
    name: "jira",
    type: "custom",
    icon: JiraIcon,
    specifiers: [
      {
        identifier: "producthub",
        metadata: {
          link: "https://nylas.atlassian.net/jira/polaris/projects/RT/ideas/view/4665863",
        },
      },
      {
        identifier: "project",
        metadata: {
          link: "https://nylas.atlassian.net/jira/software/c/projects/SS/boards/148/timeline",
        },
      },
    ],
  },
  {
    name: "competitors",
    type: "custom",
    icon: CompetitorsIcon,
    specifiers: [
      {
        identifier: "cronofy",
        metadata: {
          link: "https://docs.google.com/document/d/1cDWECUY3Hn0uWtasGMCQErr_fHqcv5VlFXnFeWW4Qzw/edit#heading=h.b50jmpwpfgtr",
        },
      },
    ],
  },
  {
    name: "PRDs",
    type: "custom",
    icon: JiraIcon,
    link: "/scheduler/PRDS",
    specifiers: [
      {
        identifier: "all",
        metadata: {
          link: "https://nylas.atlassian.net/wiki/spaces/SS/pages/328925432/PRDs",
        },
      },
      {
        identifier: "reminders",
        metadata: {
          link: "https://nylas.atlassian.net/wiki/x/IYBRIw",
        },
      },
      {
        identifier: "observability",
        metadata: {
          link: "https://nylas.atlassian.net/wiki/x/HYDuKg",
        },
      },
      {
        identifier: "get_all /bookings",
        metadata: {
          link: "https://nylas.atlassian.net/wiki/x/GgDtKg",
        },
      },
      {
        identifier: "grant expiry",
        metadata: {
          link: "https://nylas.atlassian.net/wiki/x/EoD4Kg",
        },
      },
      {
        identifier: "group meetings",
        metadata: {
          link: "https://nylas.atlassian.net/wiki/x/EoDqKg",
        },
      },
    ],
  },
  // Add more resources for scheduler
];
