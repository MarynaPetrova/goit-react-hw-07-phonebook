import { useEffect, useState } from 'react';
import css from './ContactForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addContactsThunk, getContactsThunk } from 'redux/contactsThunk';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ContactForm = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    dispatch(getContactsThunk());
  }, [dispatch]);

  const formatPhoneNumber = (value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 6) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;

    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 5)}-${phoneNumber.slice(5, 7)}`;
  };

  const handleChange = evt => {
    const { name, value } = evt.target;
    if (name === 'number') {
      setNumber(formatPhoneNumber(value));
    } else {
      setName(value);
    }
  };

  const reset = () => {
    setName('');
    setNumber('');
  };

  const contacts = useSelector(state => state.contacts.items);

  return (
    <form
      className={css.form}
      onSubmit={e => {
        const notify = () => toast(`${name} is already in contacts`);
        const contact = {
          name: name,
          phone: number,
        };
        e.preventDefault();
        if (
          contacts.some(
            contact => contact.name.toLocaleLowerCase() === name.toLocaleLowerCase()
          )
        ) {
          notify();
        } else {
          dispatch(addContactsThunk(contact));
          reset();
        }
      }}
    >
      <div>
        <label className={css.label}>
          <span>Name</span>
        </label>
        <input
          className={css.input}
          value={name}
          onChange={handleChange}
          type="text"
          name="name"
          pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          required
        />

        <label className={css.label}>
          <span>Number</span>
        </label>
        <input
          className={css.input}
          value={number}
          onChange={handleChange}
          type="tel"
          name="number"
          pattern="\d{3}-\d{2}-\d{2}"
          title="Phone number must be in the format 000-00-00"
          required
        />
      </div>

      <button className={css.btn} type="submit">
        Add contact
      </button>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        theme="dark"
      />
    </form>
  );
};
