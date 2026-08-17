function renderListView() {
    trackerView.innerHTML = "";
    cleanupDurationElements();

    const visibleTasks = getVisibleTasks();
    const groups = groupTasks(visibleTasks, pageSettings.group);

    groups.forEach(group => {
        trackerView.append(createTaskGroup(group));
    });

    if (pageSettings.group === GROUP.CATEGORY) {
        trackerView.append(createAddCategoryButton());
    }
}