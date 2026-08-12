function renderBoardView() {
    trackerView.innerHTML = "";
    durationElements.clear();

    const visibleTasks = getVisibleTasks();
    const groups = groupTasks(visibleTasks, viewSettings.group);

    groups.forEach(group => {
        trackerView.append(createTaskGroup(group));
    });

    if (viewSettings.group === GROUP.CATEGORY) {
        trackerView.append(createAddCategoryButton());
    }

    initTaskGroupSortable(trackerView);
}