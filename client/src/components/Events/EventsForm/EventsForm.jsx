import { Formik, Form, Field, ErrorMessage } from "formik";
import Schems from "../../../utils/validators/validationSchems";
import styles from "./EventsForm.module.sass";

function EventsForm({handleAddEvent}) {
  return (
    <Formik
            initialValues={{
              name: "",
              date: "",
              time: "",
              notifyBefore: 5,
            }}
            validationSchema={Schems.EventsSchema}
            onSubmit={handleAddEvent}
          >
            {() => (
              <Form className={styles.form}>
                <div className={styles.formRow}>
                  <Field type="text" name="name" placeholder="Name of the event" />
                  <ErrorMessage name="name" component="div" className={styles.error} />
                </div>
    
                <div className={styles.formRow}>
                  <Field type="date" name="date" />
                  <ErrorMessage name="date" component="div" className={styles.error} />
                </div>
    
                <div className={styles.formRow}>
                  <Field type="time" name="time" />
                  <ErrorMessage name="time" component="div" className={styles.error} />
                </div>
    
                <div className={styles.formRow}>
                  <Field
                    type="number"
                    name="notifyBefore"
                    min="1"
                    placeholder="How many minutes to remind?"
                  />
                  <ErrorMessage
                    name="notifyBefore"
                    component="div"
                    className={styles.error}
                  />
                </div>
    
                <button type="submit">Add</button>
              </Form>
            )}
          </Formik>
  )
}

export default EventsForm;