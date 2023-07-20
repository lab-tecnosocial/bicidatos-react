import { auth } from '../../database/firebase'
import { FileUpload } from './FileUpload'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import db from '../../database/firebase'
import Toaster from '../Toaster'
import './FormBici.css'

export const FormBici = () => {
  const [showOtherColorInput, setShowOtherColorInput] = useState(false)
  const [colors, setColors] = useState(["Negro", "Blanco", "Naranja", "Azul"])
  const [showToaster, setShowToaster] = useState(false);

  const handleCloseToaster = () => {
    setShowToaster(false);
  };

  const handleColorChange = (event, formik) => {
    const selectedColor = event.target.value;
    console.log(selectedColor);

    setShowOtherColorInput(selectedColor === 'Otro');

    formik.setFieldValue('color', selectedColor);
  };

  const handleSubmit = (values) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid
      const userBicicletasRef = db.collection('usuarios').doc(userId).collection('bicicletas')

      userBicicletasRef
        .add({
          nroSerieSticker: values.nroSerieSticker,
          nroSerieMarco: values.nroSerieMarco,
          color: showOtherColorInput ? values.otroColor : values.color,
          marca: values.marca,
          modelo: values.modelo,
          tipo: values.tipo,
          estado: values.estado,
        })
        .then(() => {
          console.log('Registro de bicicleta almacenado correctamente')

          if (showOtherColorInput) {
            const customColorsRef = db.collection('usuarios').doc(userId).collection('customColors')
            customColorsRef.add({ color: values.otroColor })
          }
        })
        .catch((error) => {
          console.log('Error al guardar el registro de bicicleta')
          console.log(error)
        })
    }
    setShowToaster(true);
  }

  return (
    <div className='bg-bici'>
      <h2 className='title'>Registro Bicicleta</h2>

      <Formik
        initialValues={{
          nroSerieSticker: '',
          nroSerieMarco: '',
          color: '',
          otroColor: '',
          marca: '',
          modelo: '',
          tipo: '',
          estado: '',
          files: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          nroSerieSticker: Yup.string().required('Requerido'),
          nroSerieMarco: Yup.string().required('Requerido'),
          color: Yup.string()
            .test('colorValidation', 'Color no válido', function (value) {
              const otroColor = this.parent.otroColor;
              if (otroColor) {
                return true;
              }
              return value === 'Otro' || ['Negro', 'Blanco', 'Naranja', 'Azul'].includes(value);
            })
            .test('requiredIfOtroColor', 'Requerido', function (value) {
              const otroColor = this.parent.otroColor;
              return !(otroColor && !value);
            }),
          otroColor: Yup.string().test('otroColorValidation', 'Requerido', function (value) {
            const color = this.parent.color;
            if (color === 'Otro') {
              return !!value;
            }
            return true;
          }),
          marca: Yup.string().required('Requerido'),
          modelo: Yup.string().required('Requerido'),
          tipo: Yup.string().notOneOf(['option'], 'Esta opcion no es permitida.').required('Requerido'),
          estado: Yup.string().required('Requerido'),
          files: Yup.array()
            .required('Requerido')
            .test('fileFormat', 'Solo se permiten archivos de imagen en formato JPG o PNG', function (value) {
              if (value && value.length) {
                const supportedFormats = ['image/jpeg', 'image/png']
                return value.every((file) => supportedFormats.includes(file.type))
              }
              return true
            }),
        })}>
        {(formik) => (
          <Form>
            <div className='form-content'>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='nroSerieSticker'>Nro. Serie sticker</label>
                  <Field className='form-input' name='nroSerieSticker' type='text' />
                  <ErrorMessage className='form-span' name='nroSerieSticker' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='nroSerieMarco'>Nro. Serie de marco</label>
                  <Field className='form-input' name='nroSerieMarco' type='text' />
                  <ErrorMessage className='form-span' name='nroSerieMarco' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='color'>Color</label>
                  <Field className='form-input form-select' as='select' name='color' onChange={(event) => handleColorChange(event, formik)} >
                    <option value=''></option>
                    {colors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                    <option value='Otro'>Otro color</option>
                  </Field>
                  <ErrorMessage className='form-span' name='color' component='span' />
                </div>

                {showOtherColorInput && (
                  <div className='form-group'>
                    <label htmlFor='otroColor'>Otro color</label>
                    <Field className='form-input' name='otroColor' type='text' />
                    <ErrorMessage className='form-span' name='otroColor' component='span' />
                  </div>
                )}

                <div className='form-group'>
                  <label htmlFor='marca'>Marca</label>
                  <Field className='form-input' name='marca' type='text' />
                  <ErrorMessage className='form-span' name='marca' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='modelo'>Modelo/Año</label>
                  <Field className='form-input' name='modelo' type='text' />
                  <ErrorMessage className='form-span' name='modelo' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='tipo'>Tipo</label>
                  <Field className='form-input form-select' as='select' name='tipo'>
                    <option value=''></option>
                    <option value='option'>Elija una opcion</option>
                    <option value='convencional'>Convencional</option>
                    <option value='carga'>De carga</option>
                    <option value='electrica'>Eléctrica</option>
                  </Field>
                  <ErrorMessage className='form-span form-tipo' name='tipo' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='estado'>Estado</label>
                  <Field className='form-input' name='estado' type='text' />
                  <ErrorMessage className='form-span' name='estado' component='span' />
                </div>

                <div className='form-group'>
                  <label htmlFor='files'>Fotografías</label>
                  <Field name='files' component={FileUpload} multiple />
                  <ErrorMessage className='form-span' name='files' component='span' />
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
