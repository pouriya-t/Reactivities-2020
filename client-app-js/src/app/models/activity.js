export class ActivityFormValues {
  id = undefined;
  title = "";
  category = "";
  description = "";
  date = undefined;
  time = undefined;
  city = "";
  venue = "";

  constructor(init) {
    if (init && init.date) {
      init.time = init.date;
    }
    Object.assign(this, init);
  }
}
