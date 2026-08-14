function renderBoardView() {
    trackerView.innerHTML = "";
    durationElements.clear();

    const visibleTasks = getVisibleTasks();
    const groups = groupTasks(visibleTasks, pageSettings.group);

    groups.forEach(group => {
        trackerView.append(createTaskGroup(group));
    });

    if (pageSettings.group === GROUP.CATEGORY) {
        trackerView.append(createAddCategoryButton());
    }

    initTaskGroupSortable(trackerView);
}