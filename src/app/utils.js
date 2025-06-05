export function showLoading(spinner, show) {
  if (spinner) spinner.classList.toggle('hidden', !show);
}

export function updateActiveButton(activeBtn, inactiveBtn) {
  if (activeBtn) activeBtn.classList.add('active');
  if (inactiveBtn) inactiveBtn.classList.remove('active');
}
