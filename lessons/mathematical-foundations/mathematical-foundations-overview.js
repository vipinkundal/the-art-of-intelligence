(function () {
  const topics = window.mathematicalFoundationTopics || [];
  const topicsById = new Map(topics.map((topic) => [topic.id, topic]));

  function firstParagraph(value) {
    if (Array.isArray(value)) {
      return value.find(Boolean) || "";
    }

    return value || "";
  }

  function topicIdFromLink(link) {
    const match = link.getAttribute("href")?.match(/\/topics\/([^/]+)\/index\.html$/);
    return match?.[1] || "";
  }

  function createExplanation(label, text, className) {
    const paragraph = document.createElement("p");
    const heading = document.createElement("strong");

    paragraph.className = className;
    heading.textContent = label;
    paragraph.append(heading, document.createTextNode(` ${text}`));
    return paragraph;
  }

  function expandTopicItem(item) {
    const link = item.querySelector("a.wiki-term");
    const topic = link ? topicsById.get(topicIdFromLink(link)) : null;

    if (!link || !topic) {
      return false;
    }

    const simpleIdea = firstParagraph(topic.simpleIdea) || topic.summary;
    const howItWorks = firstParagraph(topic.howItWorks);
    const whyItMatters = firstParagraph(topic.whyItMatters);
    const title = document.createElement("h3");
    const deepDive = document.createElement("a");

    title.className = "topic-overview-title";
    title.append(link);

    deepDive.className = "topic-overview-link";
    deepDive.href = link.getAttribute("href");
    deepDive.textContent = "Explore the full topic";
    deepDive.setAttribute("aria-label", `Explore the full ${topic.title} topic`);

    item.classList.add("topic-overview-card");
    item.replaceChildren(
      title,
      createExplanation("Key idea:", simpleIdea, "topic-overview-lead"),
      createExplanation("How it works:", howItWorks, "topic-overview-detail"),
      createExplanation("Why it matters for AI:", whyItMatters, "topic-overview-detail topic-overview-ai"),
      deepDive
    );

    return true;
  }

  document.querySelectorAll("ul.topic-detail-list").forEach((list) => {
    const items = Array.from(list.children).filter((item) => item.matches("li"));
    const expandedCount = items.reduce((count, item) => count + Number(expandTopicItem(item)), 0);

    if (expandedCount > 0) {
      list.classList.add("topic-overview-list");
      list.dataset.expandedTopicCount = String(expandedCount);
    }
  });
})();
