import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import classnames from 'classnames'

class ContactForm extends Component {
 renderField = ({ input , label, type, meta: {touched, error} }) => (
     <div className={classnames('mt3', {error:touched && error})}>
     <label className='db fw6 1h-copy f6' for={label}>
       {label}
     </label>
     <input className='pa2 input-reset ba bg-transparent
                       hover-bg-black hover-white w-100'
            {...input}
            type={type}
            placeholder={label}>
     </input>
     {touched && error && <span className='error'>{error.message}</span>}
     </div>
 
 )
   render(){
     const {handleSubmit, submitting, loading  } = this.props
     return (
     <main className='pa4 black-80'>
     <form className='measure center' onSubmit={handleSubmit} loading={loading}>
     <fieldset id='add_new_contact' className='ba b--transparent ph0 mh0'>
       <legend className='f4 fw6 ph0 mh0'>Add New Contact</legend>
       <Field name='name.first' type='text' component={this.renderField} label='First Name' />
       <Field name='name.last' type='text' component={this.renderField} label='Last Name' />
       <Field name='phone' type='text' component={this.renderField} label='Phone' />
       <Field name='email' type='text' component={this.renderField} label='email' />
     </fieldset>
     <div>
       <input className='b ph3 pv2 input-reset ba b--black
                         bg-transparent grow pointer f6 dib'
             type='submit'
             value='Add Contact'
             disabled={submitting}>
       </input>
     </div>
     </form>
     </main>
     )
   }
 }
export default reduxForm({form: 'contact'})(ContactForm)
