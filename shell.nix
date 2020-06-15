{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_latest
    pkgs.nodePackages.typescript
    pkgs.nodePackages.neovim
  ];
}
