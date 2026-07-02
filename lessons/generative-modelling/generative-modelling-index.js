(function () {
  function topicIdFromHref(href) {
    const match = href.match(/^topics\/([^/]+)\/index\.html$/);
    return match ? match[1] : "";
  }

  const topicsById = new Map(
    (window.generativeModellingTopics || []).map((topic) => [topic.id, topic]),
  );

  document.querySelectorAll(".topic-detail-list strong .wiki-term").forEach((topicLink) => {
    const topicId = topicIdFromHref(topicLink.getAttribute("href") || "");
    const topic = topicsById.get(topicId);
    const resource = topic?.resources?.[0];

    if (!resource || topicLink.parentElement.querySelector(".topic-source-link")) {
      return;
    }

    const resourceLink = document.createElement("a");
    resourceLink.className = "topic-source-link";
    resourceLink.href = resource.url;
    resourceLink.target = "_blank";
    resourceLink.rel = "noopener noreferrer";
    resourceLink.title = resource.label;
    resourceLink.ariaLabel = `External resource for ${topic.title}: ${resource.label}`;
    resourceLink.textContent = "source";

    topicLink.after(document.createTextNode(" "), resourceLink);
  });
})();
