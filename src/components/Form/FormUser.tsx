import { Formik, Field, Form, ErrorMessage } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import crypto from 'crypto'
import db from '../../database/firebase'
import Toaster from '../Toaster'
import './FormUser.css'

const departamentos = {
  'La Paz': [
    'Achacachi', 'El Alto', 'Viacha', 'Palca', 'Mecapaca', 'La Paz', 'Copacabana', 'Chulumani', 'Palos Blancos', 'Caranavi', 'Coroico', 'Sorata', 'Apolo', 'Curva', 'Puerto Acosta', 'Charazani',
  ],
  'Cochabamba': [
    'Cercado', 'Quillacollo', 'Sacaba', 'Colcapirhua',
    'Tiquipaya', 'Vinto', 'Sipe Sipe', 'Arani', 'Arque', 'Ayopaya', 'Bolívar',
    'Capinota', 'Carrasco', 'Chapare', 'Esteban Arce', 'Germán Jordán',
    'Mizque', 'Punata', 'Tapacarí', 'Totora', 'Toco', 'Pojo', 'Pocona', 'Tiraque', 'Independencia', 'Tarata', 'Anzaldo', 'Villa Rivero', 'Colomi', 'Tolata', 'Cliza', 'Tunarí',
  ],
  'Santa Cruz': [
    'Andrés Ibáñez', 'Warnes', 'Santa Cruz de la Sierra', 'El Torno', 'Porongo', 'La Guardia', 'Monserrat', 'Fernández Alonso', 'San Carlos', 'San Juan', 'San Pedro', 'El Puente', 'Pailón', 'Cabezas', 'San Julián', 'San Ramón', 'Cuatro Cañadas', 'San Ignacio de Velasco', 'San Miguel', 'Santa Rosa del Sara', 'Ascensión de Guarayos', 'Urubichá', 'Yapacaní', 'San Javier', 'Concepción',
  ],
  'Oruro': [
    'Cercado', 'El Choro', 'Caracollo', 'Huanuni', 'Poopó', 'Santuario de Quillacas', 'Salinas de Garci Mendoza', 'Eucaliptus', 'Sabaya', 'Sebastián Pagador', 'Turco'],
  'Potosí': [
    'Tomás Frías', 'Potosí', 'Uyuni', 'Villazón', 'Tupiza', 'Cotagaita', 'Tinguipaya', 'Betanzos', 'Chaqui', 'Colquechaca', 'Llallagua', 'Puna', 'San Agustín', 'San Pedro de Buena Vista', 'Uncía',
  ],
  'Chuquisaca': [
    'Oropeza', 'Sucre', 'Yotala', 'Poroma', 'Tomina', 'Zudáñez', 'Azurduy', 'Camargo', 'Villa Serrano', 'Villa Zudañez', 'Tarabuco', 'Padilla'],
  'Tarija': [
    'Cercado', 'Uriondo', 'Yunchará', 'Padcaya', 'El Puente', 'San Lorenzo', 'El Carmen', 'Bermejo', 'Villa Montes', 'Entre Ríos'],
  'Beni': [
    'Cercado', 'Trinidad', 'Guayaramerín', 'Riberalta', 'Reyes', 'Rurrenabaque', 'San Borja', 'San Ignacio de Moxos', 'Santa Ana del Yacuma', 'San Andrés'],
  'Pando': [
    'Cobija', 'Porvenir', 'Federico Román', 'Madre de Dios', 'Puerto Rico'],
}

export const FormUser = () => {
  const [showToaster, setShowToaster] = useState(false);

  const handleCloseToaster = () => {
    setShowToaster(false);
  };

  return (
    <div className='bg-user'>
      <h2 className='title'>Registro Usuario</h2>

      <Formik
        initialValues={{
          correo: '',
          contrasena: '',
          tipoDoc: '',
          numDoc: '',
          nombreApellido: '',
          genero: '',
          departamento: '',
          municipio: '',
          numCelular: '',
          tipoSangre: '',
          nombreContacto: '',
          numeroContacto: '',
        }}
        onSubmit={(values) => {
          console.log(values)
          const hashedPassword = crypto.createHash('sha256').update(values.contrasena).digest('hex')
          db.collection('usuarios')
            .add({
              correo: values.correo,
              contrasena: hashedPassword,
              tipoDoc: values.tipoDoc,
              numDoc: values.numDoc,
              nombreApellido: values.nombreApellido,
              genero: values.genero,
              departamento: values.departamento,
              municipio: values.municipio,
              numCelular: values.numCelular,
              tipoSangre: values.tipoSangre,
              nombreContacto: values.nombreContacto,
              numeroContacto: values.numeroContacto,
            })
            .then(() => {
              console.log('Se agrego correctamente')
            })
            .catch((error) => {
              console.log('Hubo un error al intentar guardar')
              console.log(error)
            })
        }}
        validationSchema={Yup.object({
          correo: Yup.string().required('Requerido').email('Ingrese una dirección de correo electrónico válida'),
          contrasena: Yup.string()
            .required('Requerido')
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número'),
          tipoDoc: Yup.string().required('Requerido'),
          numDoc: Yup.string().required('Requerido'),
          nombreApellido: Yup.string().required('Requerido'),
          genero: Yup.string().notOneOf(['option'], 'Esta opcion no es permitida.').required('Requerido').oneOf(['femenino', 'masculino'], 'Seleccione un género válido'),
          departamento: Yup.string().required('Requerido'),
          municipio: Yup.string()
            .test({
              name: 'municipio',
              test: function (value) {
                const departamento = this.resolve(Yup.ref('departamento')) as keyof typeof departamentos
                if (departamento && departamentos[departamento]) {
                  return value !== ''
                }
                return true
              },
              message: 'Debe seleccionar un municipio',
            })
            .required('Requerido'),
          numCelular: Yup.string()
            .required('Requerido')
            .matches(/^[0-9]+$/, 'Ingrese solo números'),
          tipoSangre: Yup.string()
            .required('Requerido')
            .matches(/^(A|B|AB|O)(\+|\-)$/, 'Seleccione un tipo de sangre válido'),
          nombreContacto: Yup.string().required('Requerido'),
          numeroContacto: Yup.string()
            .required('Requerido')
            .matches(/^[0-9]+$/, 'Ingrese solo números'),
        })}>
        {(formik) => (
          <Form>
            <div className='form-content'>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='correo'>Correo electronico</label>
                  <Field className='form-input' name='correo' type='correo' />
                  <ErrorMessage className='form-span' name='correo' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='contrasena'>Contraseña</label>
                  <Field className='form-input' name='contrasena' type='password' />
                  <ErrorMessage className='form-span' name='contrasena' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='tipoDoc'>Tipo de documento</label>
                  <Field className='form-input' name='tipoDoc' type='text' />
                  <ErrorMessage className='form-span' name='tipoDoc' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='numDoc'>Número de documento</label>
                  <Field className='form-input' name='numDoc' type='number' />
                  <ErrorMessage className='form-span' name='numDoc' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='nombreApellido'>Nombres y apellidos</label>
                  <Field className='form-input' name='nombreApellido' type='text' />
                  <ErrorMessage className='form-span' name='nombreApellido' component='span' />
                </div>
                <div className='form-group'>
                  <label htmlFor='genero'>Género</label>
                  <Field className='form-input form-select' as='select' name='genero'>
                    <option value=''></option>
                    <option value='femenino'>Femenino</option>
                    <option value='masculino'>Masculino</option>
                  </Field>
                  <ErrorMessage className='form-span form-tipo' name='genero' component='span' />
                </div>
                <div className='form-group'>
                  <label htmlFor='departamento'>Departamento</label>
                  <Field className='form-input form-select' as='select' name='departamento'>
                    <option value=''></option>
                    <option value='La Paz'>La Paz</option>
                    <option value='Santa Cruz'>Santa Cruz</option>
                    <option value='Cochabamba'>Cochabamba</option>
                    <option value='Oruro'>Oruro</option>
                    <option value='Potosí'>Potosí</option>
                    <option value='Tarija'>Tarija</option>
                    <option value='Chuquisaca'>Chuquisaca</option>
                    <option value='Beni'>Beni</option>
                    <option value='Pando'>Pando</option>
                  </Field>
                  <ErrorMessage className='form-span form-tipo' name='departamento' component='span' />
                </div>

                {departamentos[formik.values.departamento] && (
                  <div className='form-group'>
                    <label htmlFor='municipio'>Municipio</label>
                    <Field className='form-input form-select' as='select' name='municipio'>
                      <option value=''></option>
                      {departamentos[formik.values.departamento].map((municipio, index) => (
                        <option key={municipio} value={municipio}>
                          {municipio}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage className='form-span form-tipo' name='municipio' component='span' />
                  </div>
                )}

                <div className='form-group'>
                  <label htmlFor='numCelular'>Telefono celular</label>
                  <Field className='form-input' name='numCelular' type='number' />
                  <ErrorMessage className='form-span' name='numCelular' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='tipoSangre'>Tipo de Sangre</label>
                  <Field className='form-input form-select' as='select' name='tipoSangre'>
                    <option value=''></option>
                    <option value='A+'>A+</option>
                    <option value='A-'>A-</option>
                    <option value='B+'>B+</option>
                    <option value='B-'>B-</option>
                    <option value='AB+'>AB+</option>
                    <option value='AB-'>AB-</option>
                    <option value='O+'>O+</option>
                    <option value='O-'>O-</option>
                  </Field>
                  <ErrorMessage className='form-span form-tipo' name='tipoSangre' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='nombreContacto'>Nombre de contacto de referencia</label>
                  <Field className='form-input' name='nombreContacto' type='text' />
                  <ErrorMessage className='form-span' name='nombreContacto' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='numeroContacto'>Número de contacto</label>
                  <Field className='form-input' name='numeroContacto' type='number' />
                  <ErrorMessage className='form-span' name='numeroContacto' component='span' />
                </div>
              </div>
            </div>

            <button className='form-btn' type='submit'>
              Registrar
            </button>
          </Form>
        )}
      </Formik>
      <Toaster
        open={showToaster}
        onClose={handleCloseToaster}
        message='¡Se guardó correctamente!'
        type='success'
      />
    </div>
  )
}
