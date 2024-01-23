// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { typescript } from './typescript';
import { rust } from './rust';
import Prism from 'prismjs';

typescript(Prism);
rust(Prism);

export default Prism;
