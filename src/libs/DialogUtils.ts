import { Dialog, QDialogOptions } from 'quasar';

type ButtonState = 'OK' | 'CANCEL';

export default class DialogUtils {
  private constructor() {
    /* */
  }

  static async showDialog(opts: QDialogOptions): Promise<{ state: ButtonState; payload: unknown }> {
    return new Promise((resolv) => {
      Dialog.create(opts)
        .onOk((payload) => {
          resolv({ state: 'OK', payload });
        })
        .onCancel(() => {
          resolv({ state: 'CANCEL', payload: undefined });
        });
    });
  }
}
